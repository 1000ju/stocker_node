-- =========================================
-- FULL RESET: drop & recreate stocker
-- =========================================

-- 안전하게 전체 초기화
DROP DATABASE IF EXISTS stocker;

CREATE DATABASE IF NOT EXISTS stocker
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE stocker;

-- (옵션) 세션 문자셋
SET NAMES utf8mb4;

-- =========================================
-- 테이블 생성 (부모 → 자식 순서)
-- =========================================

-- USERS
CREATE TABLE `user` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(255),
    profile_image_url TEXT,
    provider VARCHAR(50),
    age INT,
    occupation VARCHAR(100),
    created_date DATE DEFAULT (CURRENT_DATE),
    access_token TEXT,
    refresh_token TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- USER SETTINGS
CREATE TABLE user_settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nickname VARCHAR(100),
    bio TEXT,
    profile_image VARCHAR(255),
    user_job VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES `user`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- MEMOS
CREATE TABLE memos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    template_type ENUM('일지','복기','체크리스트','자유','재무제표') NOT NULL,
    content JSON NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INVESTMENT MASTER
CREATE TABLE investment_master (
    master_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    bio TEXT,
    portfolio_summary TEXT,
    portfolio JSON,
    image_url VARCHAR(255),
    style VARCHAR(255),
    type_code VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INVESTMENT PROFILE
CREATE TABLE investment_profile (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type_code VARCHAR(100),
    matched_master TEXT,
    FOREIGN KEY (user_id) REFERENCES `user`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TEST MASTER (성향검사지 마스터)
CREATE TABLE test_master (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(20),
    dimension_code CHAR(1),
    dimension_name VARCHAR(50),
    left_label VARCHAR(50),
    right_label VARCHAR(50),
    left_desc VARCHAR(50),
    right_desc VARCHAR(50),
    global_no INT,
    dm_no INT,
    question_text VARCHAR(500),
    is_reverse TINYINT(1),
    note VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CHAPTERS
CREATE TABLE chapter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    keyword VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- QUIZZES
CREATE TABLE quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT,
    question TEXT,
    option_1 TEXT,
    option_2 TEXT,
    option_3 TEXT,
    option_4 TEXT,
    correct_option INT,
    hint TEXT,
    FOREIGN KEY (chapter_id) REFERENCES chapter(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- THEORY
CREATE TABLE theory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT,
    word VARCHAR(255),
    content TEXT,
    FOREIGN KEY (chapter_id) REFERENCES chapter(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- WRONG NOTE
CREATE TABLE wrong_note (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT,
    chapter_id INT,
    user_id INT,
    created_date DATE,
    selected_option INT,
    FOREIGN KEY (quiz_id) REFERENCES quiz(id),
    FOREIGN KEY (chapter_id) REFERENCES chapter(id),
    FOREIGN KEY (user_id) REFERENCES `user`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CHAPTER PROGRESS
CREATE TABLE chapter_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    chapter_id INT,
    is_theory_completed BOOLEAN,
    is_quiz_completed BOOLEAN,
    is_chapter_completed BOOLEAN,
    current_theory_id BIGINT,
    current_quiz_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES `user`(id),
    FOREIGN KEY (chapter_id) REFERENCES chapter(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ATTENDANCE
CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date DATE,
    is_present BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES `user`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ATTENDANCE_QUIZ (퀴즈 마스터, 출석과 무관하게 저장)
CREATE TABLE attendance_quiz (
    quizOX_id INT AUTO_INCREMENT PRIMARY KEY,
    question_OX TEXT NOT NULL,
    is_correct TINYINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================
-- 기본 데이터 INSERT
-- =========================================

-- 투자 거장 마스터
INSERT INTO investment_master (master_id, name, bio, portfolio_summary, portfolio, image_url, style, type_code)
VALUES
(1, '워렌 버핏', '버크셔 해서웨이 회장, ''오마하의 현인''', '소수의 우량 기업 주식을 장기 보유하며 복리 효과를 극대화합니다. 시장 변동성에 대비해 높은 현금 비중을 유지하는 것으로 유명합니다.', JSON_OBJECT('선물',0,'주식',80,'원자재',0,'현금',20), 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Warren_Buffett_with_Fisher_College_of_Business_Student_-_4395157720_%28cropped%29.jpg/640px-Warren_Buffett_with_Fisher_College_of_Business_Student_-_4395157720_%28cropped%29.jpg', '가치 투자', 'CLPD'),
(2, '피터 린치', '전설적인 마젤란 펀드 매니저, ''월가의 영웅''', '일상생활에서 성장 가능성이 보이는 ''10루타(Ten-bagger)'' 종목을 발굴하는 생활 밀착형 투자를 선호합니다. 수백 개 이상의 종목에 분산 투자하는 것으로도 유명합니다.', JSON_OBJECT('선물',5,'주식',85,'원자재',0,'현금',10), 'https://i.namu.wiki/i/7uOtqQoKoD3TPG5cWCOvCSbSd5r6HhZkTVo2B6Cd_A5JS8YQivTjcnMUW2CaC0cv1Thot3EcaKo55ydQabCftiSEEfkFCnpp-B6gp97HJunyQExHAt7QZCA4LwHsWMtPRMdvB5Ggpva3y0fjZwoQOw.webp', '성장주 투자', 'ELAD'),
(3, '레이 달리오', '세계 최대 헤지펀드 브리지워터 창립자', '어떤 경제 상황에서도 안정적인 성과를 내는 ''올웨더(All-Weather)'' 포트폴리오를 개발했습니다. 주식, 채권, 원자재 등에 분산 투자하여 리스크를 최소화합니다.', JSON_OBJECT('선물',55,'주식',30,'원자재',15,'현금',0), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Web_Summit_2018_-_Forum_-_Day_2%2C_November_7_HM1_7481_%2844858045925%29.jpg/640px-Web_Summit_2018_-_Forum_-_Day_2%2C_November_7_HM1_7481_%2844858045925%29.jpg', '자산 배분', 'CLAD'),
(4, '존 보글', '뱅가드 그룹 창립자, ''인덱스 펀드의 아버지''', '''건초더미에서 바늘을 찾으려 하지 말고, 건초더미 전체를 사라''는 철학으로 시장 지수를 추종하는 저비용 인덱스 펀드 투자를 강조합니다.', JSON_OBJECT('선물',40,'주식',60,'원자재',0,'현금',0), 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Photo_of_a_John_C._Bogle_By_Bill_Cramer.jpg/640px-Photo_of_a_John_C._Bogle_By_Bill_Cramer.jpg', '패시브 투자', 'CLPI'),
(5, '벤저민 그레이엄', '가치 투자의 창시자이자 워렌 버핏의 스승', '기업의 내재 가치보다 현저히 낮은 가격에 거래되는 ''안전 마진''을 확보한 주식에 투자할 것을 강조했습니다. 주식과 채권 비중을 50:50으로 유지하는 것을 이상적으로 보았습니다.', JSON_OBJECT('선물',50,'주식',50,'원자재',0,'현금',0), 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Benjamin_Graham_%281894-1976%29_in_1950.jpg/640px-Benjamin_Graham_%281894-1976%29_in_1950.jpg', '가치 투자', 'CLPD'),
(6, '칼 아이칸', '월가의 ''기업 사냥꾼'', 행동주의 투자자', '저평가된 기업의 지분을 대량 매입한 뒤, 적극적으로 경영에 개입하여 기업 가치를 끌어올리고 수익을 창출합니다. 포트폴리오가 소수 주식에 집중되는 경향이 있습니다.', JSON_OBJECT('선물',10,'주식',85,'원자재',0,'현금',5), 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Carl_Icahn%2C_1980s.jpg/640px-Carl_Icahn%2C_1980s.jpg', '행동주의 투자', 'ESAI'),
(7, '데이비드 테퍼', '아팔루사 매니지먼트 창립자, 부실자산 투자 전문가', '금융 위기 등 시장이 가장 비관적일 때, 부실 채권이나 저평가 주식을 대담하게 매입하여 높은 수익을 올리는 역발상 투자로 유명합니다.', JSON_OBJECT('선물',20,'주식',65,'원자재',5,'현금',10), 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/David_Tepper_01.jpg/640px-David_Tepper_01.jpg', '역발상/부실자산 투자', 'ESAD'),
(8, '조지 소로스', '퀀텀 펀드를 이끈 전설적인 매니저, ''영란은행을 무너뜨린 사나이''', '거시 경제의 흐름을 읽고 통화, 금리 등에 과감하게 베팅하는 ''글로벌 매크로'' 전략을 사용합니다. 재귀성 이론을 바탕으로 시장의 심리를 역이용합니다.', JSON_OBJECT('선물',40,'주식',30,'원자재',15,'현금',15), 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/George_Soros%2C_2002.jpg/640px-George_Soros%2C_2002.jpg', '글로벌 매크로', 'ELAD'),
(9, '빌 애크먼', '퍼싱 스퀘어 캐피털 CEO, 집중 투자 전문가', '소수의 잘 이해하고 있는 우량 기업에 자본을 집중하여 장기 보유하는 전략을 구사합니다. 때로는 대담한 공매도 베팅으로도 잘 알려져 있습니다.', JSON_OBJECT('선물',5,'주식',85,'원자재',0,'현금',10), 'https://i.namu.wiki/i/6ynj1QjTx2wDeEr5swwevqw6pVsvHjLH1qLkSo2e2u2wvNkYXQtyjOXbjnLBiVxLwsFeYbmtJLr3St1lcfbrpwAh_8Grgdi0A2yZBZXzrA_klnul2Ce7H7AAUpFSOgq4AXGWre87fUiL8WiUgIIE2Q.webp', '집중 투자', 'ELPD'),
(10, '짐 로저스', '조지 소로스와 퀀텀 펀드를 공동 설립한 전설적 투자자', '수요와 공급의 원칙에 따라 원자재 시장의 장기적인 상승에 베팅하는 것으로 매우 유명합니다. ''가치 있는 것은 싸게 사라''는 철학을 가지고 있습니다.', JSON_OBJECT('선물',20,'주식',30,'원자재',40,'현금',10), 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Jim-rogers-madrid-160610.jpg/640px-Jim-rogers-madrid-160610.jpg', '원자재 투자', 'CLAI'),
(11, '일론 머스크', '테슬라, 스페이스X CEO, 혁신의 아이콘', '전통적인 포트폴리오 투자자가 아니며, 자산 대부분이 자신이 창업한 기업의 주식(테슬라, 스페이스X 등)으로 구성되어 있습니다. 미래 기술에 대한 담대한 비전을 보고 투자합니다.', JSON_OBJECT('선물',0,'주식',95,'원자재',0,'현금',5), 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/640px-Elon_Musk_Royal_Society_%28crop2%29.jpg', '혁신 기술 투자', 'ELAI'),
(12, '마크 큐반', '억만장자 기업가이자 NBA 댈러스 매버릭스 구단주', '성공한 사업가로서, 포트폴리오의 상당 부분을 잠재력 있는 스타트업 및 기술 기업에 투자합니다. 또한 시장 변동성에 대비해 높은 비중의 현금을 보유하는 것을 선호합니다.', JSON_OBJECT('선물',0,'주식',60,'원자재',0,'현금',40), 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mark_Cuban_%282024%29_%28cropped%29.jpg/640px-Mark_Cuban_%282024%29_%28cropped%29.jpg', '기술/벤처 투자', 'ESPI'),
(13, '존 폴슨', '2008년 금융위기 공매도로 막대한 부를 쌓은 헤지펀드 매니저', '인수합병, 파산, 구조조정 등 특정 기업 이벤트 발생 시 나타나는 가격 불일치를 이용해 수익을 내는 ''이벤트 드리븐'' 전략의 대가입니다.', JSON_OBJECT('선물',30,'주식',50,'원자재',10,'현금',10), 'https://i.namu.wiki/i/wTMfoEe4bIIS4udhPhNHjjk7ka3IGM3FWoG4XhvjOZ05SJVjrmEcPv1nsqEAwzCSh8A7Dtb0uLPdCZMcyhWWiQj3YkxlOKqVJbfEejrF3JjNpmjHV-nFoIXsg9hR3355jpFTmRIqSy3dck4ws5DSyA.webp', '이벤트 드리븐', 'ESPD'),
(14, '찰리 멍거', '워렌 버핏의 평생 파트너이자 버크셔 해서웨이 부회장', '버핏과 함께 가치 투자의 핵심 원칙을 공유합니다. 극도로 인내심을 갖고 소수의 위대한 기업에 집중 투자하는 것을 강조했습니다.', JSON_OBJECT('선물',0,'주식',85,'원자재',0,'현금',15), 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Charlie_Munger_%28cropped%29.jpg/640px-Charlie_Munger_%28cropped%29.jpg', '가치 투자', 'CLPD'),
(15, '하워드 막스', '오크트리 캐피털 창립자, ''투자의 구루''', '부실 채권(Distressed Debt) 투자의 대가입니다. 시장의 심리를 꿰뚫고, 남들이 공포에 빠졌을 때 과감하게 투자하는 2차적 사고를 강조합니다.', JSON_OBJECT('선물',70,'주식',15,'원자재',0,'현금',15), 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Howard_Marks_2.17.12_%28cropped%29.jpg/640px-Howard_Marks_2.17.12_%28cropped%29.jpg', '부실 채권 투자', 'CLAD'),
(16, '캐시 우드', 'ARK 인베스트 CEO, ''파괴적 혁신'' 전도사', '인공지능, 블록체인, 유전자 기술 등 미래를 바꿀 파괴적 혁신 기술을 보유한 기업에 집중적으로 투자합니다. 높은 변동성을 감수하고 장기적인 고수익을 추구합니다.', JSON_OBJECT('선물',0,'주식',95,'원자재',0,'현금',5), 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Cathie_Wood_ARK_Invest_Photo.jpg/640px-Cathie_Wood_ARK_Invest_Photo.jpg', '혁신 성장주', 'ELPI');

-- 출석 퀴즈 마스터 (컬럼 순서 주의: question_OX → is_correct)
-- is_correct: 1=정답(O), 0=오답(X)
INSERT INTO attendance_quiz (quizOX_id, question_OX, is_correct) VALUES
(1, '장기투자는 기업의 본질가치 성장에 베팅하는 방식이다.', 1),
(2, '주식은 기업의 소유권 일부를 의미한다.', 1),
(3, 'PER은 주가를 주당순이익(EPS)으로 나눈 값이다.', 1),
(4, 'PBR은 주가를 주당순자산가치(BPS)로 나눈 비율이다.', 1),
(5, 'ROE는 자기자본이익률을 의미한다.', 1),
(6, '재무제표는 기업의 건강상태를 알려주는 기본 자료다.', 1),
(7, '분산투자는 리스크를 줄이는 효과가 있다.', 1),
(8, '단기수익률보다 꾸준한 누적수익률이 더 중요하다.', 1),
(9, '코스피는 유가증권시장에 상장된 기업들로 구성된다.', 1),
(10, '코스닥은 기술 중심 중소형 기업들이 주로 상장된 시장이다.', 1),
(11, '주식의 가격은 수요와 공급에 의해 결정된다.', 1),
(12, '거래량은 투자자들의 관심 정도를 반영한다.', 1),
(13, '시가총액은 주가 x 발행주식수로 계산된다.', 1),
(14, '배당주는 안정적인 현금흐름을 제공할 수 있다.', 1),
(15, '주가는 미래의 기대가치를 반영한다.', 1),
(16, '기관투자자는 펀드나 보험사 같은 큰 자금운용 주체를 말한다.', 1),
(17, '개인투자자의 매매 비중이 높은 종목은 변동성이 크다.', 1),
(18, '금리가 상승하면 대체로 주가에는 부정적 영향을 준다.', 1),
(19, '인플레이션이 높으면 기업의 원가부담이 커질 수 있다.', 1),
(20, '중앙은행의 기준금리 결정은 주식시장에 큰 영향을 준다.', 1),
(21, '분기보고서는 기업이 3개월 단위로 실적을 공시하는 자료다.', 1),
(22, '기술적 분석은 가격과 거래량을 중심으로 시장을 해석한다.', 1),
(23, '기본적 분석은 기업의 내재가치를 평가하는 방법이다.', 1),
(24, '캔들차트는 시가·고가·저가·종가 정보를 담고 있다.', 1),
(25, '이평선은 일정 기간 주가의 평균을 선으로 나타낸 것이다.', 1),
(26, '골든크로스는 단기 이평선이 장기 이평선을 상향 돌파하는 현상이다.', 1),
(27, '데드크로스는 단기 이평선이 장기 이평선을 하향 돌파하는 것이다.', 1),
(28, '손절매는 감정에 휘둘리지 않기 위한 중요한 투자습관이다.', 1),
(29, '추세 추종 전략은 시장의 흐름을 따라가는 투자 방식이다.', 1),
(30, '역발상 투자자는 시장의 과도한 공포 속에서 기회를 찾는다.', 1),
(31, '심리적 요인도 주가 변동에 큰 영향을 준다.', 1),
(32, '주식시장은 완전합리적이지 않다.', 1),
(33, '기업의 실적은 장기적으로 주가를 움직이는 핵심 요인이다.', 1),
(34, 'EPS가 상승하면 주가가 상승할 가능성이 높다.', 1),
(35, '배당수익률은 배당금 / 주가 * 100으로 계산된다.', 1),
(36, '유상증자는 새로운 주식을 발행해 자본금을 늘리는 행위다.', 1),
(37, '무상증자는 기존 주주에게 새 주식을 무상으로 나누어주는 것이다.', 1),
(38, '주식분할은 거래를 원활히 하기 위해 액면가를 낮추는 조치다.', 1),
(39, '주가가 급락할 때는 유동성 위기 가능성도 함께 점검해야 한다.', 1),
(40, '환율 상승은 수출기업에 유리할 수 있다.', 1),
(41, '환율 하락은 수입기업에 유리할 수 있다.', 1),
(42, 'ETF는 특정 지수를 추종하는 상장지수펀드다.', 1),
(43, '인덱스 투자는 시장 전체의 성장을 목표로 한다.', 1),
(44, '레버리지 ETF는 수익률을 배로 확대하지만 손실도 커진다.', 1),
(45, '주식은 예금보다 위험하지만 장기수익률은 더 높을 수 있다.', 1),
(46, '분기 실적이 좋지 않아도 장기 성장성은 유지될 수 있다.', 1),
(47, '시장의 공포는 종종 좋은 매수 기회가 된다.', 1),
(48, '하락장에서도 꾸준히 투자하면 평균단가를 낮출 수 있다.', 1),
(49, '기술주 투자는 성장성 분석이 중요하다.', 1),
(50, '가치주는 안정적 이익과 저평가가 포인트다.', 1),
(51, '성장주는 미래의 확장 가능성이 중요하다.', 1),
(52, '배당성향은 순이익 중 배당금으로 지급되는 비율이다.', 1),
(53, '경기 방어주는 불황에도 실적이 비교적 안정적이다.', 1),
(54, '주식의 리스크는 변동성으로 측정될 수 있다.', 1),
(55, '원자재 가격 상승은 제조업체에 부담 요인이다.', 1),
(56, '경기 사이클은 기업 실적과 주가에 영향을 준다.', 1),
(57, '투자에서 감정 관리가 수익률보다 더 중요할 때가 있다.', 1),
(58, '투자는 ''확률 게임''이지 ''확신의 게임''이 아니다.', 1),
(59, '투자 일지는 자신의 매매 습관을 점검하는 데 도움이 된다.', 1),
(60, '장기적으로는 복리의 힘이 크게 작용한다.', 1),
(61, '단타보다 장기투자가 심리적으로 안정적이다.', 1),
(62, 'ETF는 초보 투자자에게 좋은 분산수단이 된다.', 1),
(63, '시황 뉴스보다 기업 공시를 우선 확인하는 습관이 좋다.', 1),
(64, '재무비율은 기업 간 비교분석에 유용하다.', 1),
(65, '우량기업도 무리한 확장은 리스크가 될 수 있다.', 1),
(66, '기업 IR(Investor Relations)은 투자자와의 신뢰창구다.', 1),
(67, '공매도는 주가 하락에 베팅하는 전략이다.', 1),
(68, '시장참여자는 항상 ''정보의 비대칭''을 인식해야 한다.', 1),
(69, '뉴스의 반응보다 ''팩트''의 영향을 따져야 한다.', 1),
(70, '손실을 줄이는 것도 ''수익을 얻는 행위''다.', 1),
(71, '좋은 기업이라도 비싼 가격에 사면 손실을 본다.', 1),
(72, '시장의 평균을 이기는 건 생각보다 어렵다.', 1),
(73, '리밸런싱은 포트폴리오 비중을 재조정하는 과정이다.', 1),
(74, 'ETF도 운용보수가 존재한다.', 1),
(75, '모르면 안 하는 것도 좋은 투자 전략이다.', 1),
(76, '주식은 빌려주는 돈이므로 만기일에 원금이 돌아온다.', 0),
(77, 'PER이 높을수록 항상 좋은 기업이다.', 0),
(78, '배당금은 회사가 원하면 언제든 줄일 수 없다.', 0),
(79, '주가가 계속 오르는 기업은 반드시 좋은 기업이다.', 0),
(80, '손절은 투자 실패를 의미하므로 절대 하면 안 된다.', 0),
(81, '실적이 좋은 회사의 주가는 절대 떨어지지 않는다.', 0),
(82, '금리 인상은 항상 주식시장에 호재다.', 0),
(83, '기술적 분석은 기업의 본질가치를 평가하는 방법이다.', 0),
(84, '코스닥은 채권 시장을 의미한다.', 0),
(85, '시가총액이 크면 반드시 주가도 높다.', 0),
(86, '배당금은 회사가 손실이어도 반드시 지급해야 한다.', 0),
(87, '분산투자는 수익률을 반드시 높여준다.', 0),
(88, '주식은 단기 매매로만 수익을 낼 수 있다.', 0),
(89, '손실이 난 주식은 무조건 오를 때까지 버텨야 한다.', 0),
(90, '장기투자는 아무 기업에나 오래 보유하면 된다.', 0),
(91, '기업의 부채가 많을수록 무조건 좋은 신호다.', 0),
(92, 'ETF는 항상 원금이 보장된다.', 0),
(93, '주가가 떨어지면 기업 가치도 자동으로 떨어진다.', 0),
(94, '상한가는 항상 투자 기회다.', 0),
(95, '주식시장에는 언제나 논리만 작용한다.', 0),
(96, '외국인 매도가 늘면 반드시 폭락이 온다.', 0),
(97, '금리와 물가는 전혀 상관이 없다.', 0),
(98, '유상증자는 주가 상승의 신호다.', 0),
(99, '뉴스에서 추천한 주식은 믿고 사도 된다.', 0),
(100, '주가는 매일 예측 가능하다.', 0),
(101, '공매도는 개인이 절대 이용할 수 없다.', 0),
(102, 'ROE가 낮을수록 기업이 효율적이다.', 0),
(103, '부채비율이 높을수록 안정적이다.', 0),
(104, '주식투자는 감정으로 하는 것이 가장 빠르다.', 0),
(105, '차트가 좋으면 실적은 볼 필요가 없다.', 0),
(106, '실적이 나빠도 주가가 오를 리 없다.', 0),
(107, '손익분기점은 매수가격보다 낮아야 한다.', 0),
(108, '주가 상승은 항상 거래량 감소와 함께 일어난다.', 0),
(109, '장기투자는 공부할 필요가 없다.', 0),
(110, 'ETF는 단일 종목과 동일한 위험을 가진다.', 0),
(111, '배당은 세금을 내지 않는다.', 0),
(112, '원자재 가격 상승은 모든 기업에 호재다.', 0),
(113, '환율이 높아지면 무조건 나쁜 현상이다.', 0),
(114, 'PBR이 높을수록 저평가다.', 0),
(115, '투자자는 감정에 충실해야 한다.', 0),
(116, '기술적 지표는 100% 정확하다.', 0),
(117, '복리는 단기투자에서 더 강하게 작용한다.', 0),
(118, '손실은 나중에 자동으로 회복된다.', 0),
(119, '시장이 하락하면 투자자는 아무것도 할 수 없다.', 0),
(120, '재무제표를 볼 줄 몰라도 투자는 충분하다.', 0),
(121, '단기 매매는 리스크가 없다.', 0),
(122, '높은 거래량은 항상 좋은 신호다.', 0),
(123, '주식시장은 항상 상승한다.', 0),
(124, '주가가 낮으면 무조건 싸다.', 0),
(125, '기업은 주가를 직접 조정할 수 있다.', 0),
(126, '공시를 읽지 않아도 충분히 투자 가능하다.', 0),
(127, '이익이 적어도 배당은 늘릴 수 있다.', 0),
(128, '경기 불황기에는 항상 주가가 오른다.', 0),
(129, '금리가 낮으면 예금이 매력적이다.', 0),
(130, '주식투자는 경험보다 운이 더 중요하다.', 0),
(131, '외국인 투자자는 시장에 영향이 없다.', 0),
(132, '손절은 비겁한 행동이다.', 0),
(133, '주식은 항상 오전에만 오른다.', 0),
(134, '코스피는 정부가 정한 가격으로 움직인다.', 0),
(135, '주가는 기업의 본질가치와 무관하다.', 0),
(136, 'PER이 낮으면 무조건 사야 한다.', 0),
(137, '장기보유는 무조건 수익을 낸다.', 0),
(138, '시장 평균을 이기는 것은 매우 쉽다.', 0),
(139, '투자자는 뉴스를 보고 즉시 매수해야 한다.', 0),
(140, '감정이 앞서면 좋은 판단을 내릴 수 있다.', 0),
(141, '주식은 단기차익만을 위한 도구다.', 0),
(142, '투자 공부는 의미가 없다.', 0),
(143, 'ETF는 마이너스가 날 수 없다.', 0),
(144, '변동성이 높을수록 안정적이다.', 0),
(145, '시가총액이 크면 항상 저평가다.', 0),
(146, '주식시장은 예금처럼 안전하다.', 0),
(147, '배당주는 무조건 수익이 높다.', 0),
(148, '손익분기점은 자동으로 오게 된다.', 0),
(149, '공포장에서는 무조건 팔아야 한다.', 0),
(150, '가격이 오른 주식은 항상 더 오른다.', 0);

-- 성향검사 마스터
INSERT INTO test_master
(id, version, dimension_code, dimension_name, left_label, right_label, left_desc, right_desc, global_no, dm_no, question_text, is_reverse, note)
VALUES
(1, 'v1.1', 'A', '리스크 수용성', 'E', 'C', 'Eager(공격적)', 'Cautious(보수적)', 1, 1, '가격이 많이 움직여도, 기회라고 느끼면 살 수 있다.', 0, 'E 정문'),
(2, 'v1.1', 'A', '리스크 수용성', 'E', 'C', 'Eager(공격적)', 'Cautious(보수적)', 2, 2, '손실이 나도, 다시 들어가서 만회를 시도하는 편이다.', 0, 'E 정문'),
(3, 'v1.1', 'A', '리스크 수용성', 'E', 'C', 'Eager(공격적)', 'Cautious(보수적)', 3, 3, '손실 가능성이 보이면 웬만하면 시작하지 않는다.', 1, 'C 정문 [역채점]'),
(4, 'v1.1', 'B', '투자 기간', 'S', 'L', 'Short-term(단기)', 'Long-term(장기)', 4, 1, '몇 주~몇 달 안에 결과가 나오는 투자가 편하다.', 0, 'S 정문'),
(5, 'v1.1', 'B', '투자 기간', 'S', 'L', 'Short-term(단기)', 'Long-term(장기)', 5, 2, '뉴스나 이슈가 생기면 빠르게 매매한다.', 0, 'S 정문'),
(6, 'v1.1', 'B', '투자 기간', 'S', 'L', 'Short-term(단기)', 'Long-term(장기)', 6, 3, '회사가치가 커질 때까지 오래 기다리는 편이다.', 1, 'L 정문 [역채점]'),
(7, 'v1.1', 'C', '투자 스타일', 'A', 'P', 'Active(액티브)', 'Passive(패시브)', 7, 1, '손절/익절 같은 내 규칙을 정하고 자주 실행한다.', 0, 'A 정문'),
(8, 'v1.1', 'C', '투자 스타일', 'A', 'P', 'Active(액티브)', 'Passive(패시브)', 8, 2, '일정 주기로 비중을 바꾸기보다는 그대로 둔다.', 0, 'A 정문'),
(9, 'v1.1', 'C', '투자 스타일', 'A', 'P', 'Active(액티브)', 'Passive(패시브)', 9, 3, '시장 평균만 따라가도 안정적이면 충분하다.', 1, 'P 정문 [역채점]'),
(10, 'v1.1', 'D', '정보 활용', 'I', 'D', 'Intuition(직관)', 'Data(데이터)', 10, 1, '제품을 써보거나 현장 느낌이 중요하다.', 0, 'I 정문'),
(11, 'v1.1', 'D', '정보 활용', 'I', 'D', 'Intuition(직관)', 'Data(데이터)', 11, 2, '큰 흐름이 맞으면 작은 숫자 차이는 괜찮다.', 0, 'I 정문'),
(12, 'v1.1', 'D', '정보 활용', 'I', 'D', 'Intuition(직관)', 'Data(데이터)', 12, 3, '데이터가 안 좋으면 과감히 줄이거나 정리한다.', 0, 'D 정문');

-- CHAPTERS
INSERT INTO chapter (title, keyword) VALUES
('주식 기초 개념', '주식'),
('재무제표 이해', '재무제표');

-- THEORIES
INSERT INTO theory (chapter_id, word, content) VALUES
(1, '주식이란?', '주식은 기업이 자금을 조달하기 위해 발행하는 소유권의 일부를 의미합니다.'),
(1, '주가 변동', '주가는 기업 가치, 수요와 공급, 경제 상황 등에 따라 변동합니다.'),
(2, '재무제표란?', '재무제표는 기업의 재무상태와 경영성과를 나타내는 보고서입니다.'),
(2, '손익계산서', '손익계산서는 일정 기간 동안의 수익과 비용을 나타내는 보고서입니다.');

-- QUIZZES
INSERT INTO quiz (chapter_id, question, option_1, option_2, option_3, option_4, correct_option, hint) VALUES
(1, '주식의 정의로 올바른 것은?', 
 '기업의 부채', 
 '기업의 소유권 일부', 
 '정부의 지원금', 
 '배당금', 
 2, '소유권을 의미하는 단어에 주목하세요.'),
(1, '주가가 변동하는 주된 이유는?', 
 '정부 보조금', 
 '기업 가치와 수요/공급', 
 '배당금 고정', 
 '법률 규제', 
 2, '경제 상황과 수요 공급에 따라 달라집니다.'),
(2, '재무제표의 목적은?', 
 '세금 계산만을 위함', 
 '기업의 재무상태와 성과 보고', 
 '광고비 집행', 
 '상품 판매', 
 2, '재무 상태와 경영 성과 관련 키워드에 집중하세요.'),
(2, '손익계산서가 나타내는 것은?', 
 '자산과 부채', 
 '현금흐름', 
 '수익과 비용', 
 '주주명부', 
 3, '수익/비용 개념이 핵심입니다.');

-- =========================================
-- 끝
-- =========================================

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
INSERT INTO investment_master (master_id, name, bio, portfolio_summary, image_url, style, type_code)
VALUES
(1, 'Warren Buffett', '버크셔 해서웨이 회장. 가치·안전마진·장기 보유', '코카콜라, 애플 등 장기 우량주를 적정가 이하에 매수 후 장기 보유', NULL, '가치·장기·저위험(Buy & Hold)·데이터 기반', 'CLPD'),
(2, 'Charlie Munger', '워렌 버핏 파트너. 인문학적 사고와 장기 투자', '소수의 질 좋은 기업을 적정 가치에 매수, 복리 효과를 노림', NULL, '가치·장기·집중·복리·분석적', 'CLPI'),
(3, 'Ray Dalio', '브리지워터 설립자. 리스크 패리티 전략', '다양화된 자산군 기반 자산배분(레버리지 기반)', NULL, '장기·데이터·매크로·리스크 관리', 'CLAD'),
(4, 'Howard Marks', '오크트리 공동창업자. 사이클/심리 분석 전문가', '사이클 하락 국면에서 보수적 매수, 가치/리스크 대비 투자', NULL, '사이클·심리·신중·가치', 'CLAI'),
(5, 'Benjamin Graham', '워렌 버핏 스승. 가치투자의 아버지', '저PBR/PER 중심의 철저한 분석, 안전마진', NULL, '가치·저평가·철저분석·안전마진', 'CSPD'),
(6, 'Walter Schloss', '벤저민 그레이엄 제자. 매우 단순 규칙으로 저평가주 매수', '저평가 종목 다수 보유 후 장기 보유', NULL, '가치·저평가·단순 원칙·장타 보유', 'CSPI'),
(7, 'Joel Greenblatt', '매직 포뮬러 저자. 수익/자본 대비 고수익 기업 투자', 'ROIC·수익성/가치 우량 기업 매수', NULL, '가치·수익성·계량화된 규칙', 'CSAD'),
(8, 'John Neff', '윈저펀드 매니저. 저퍼·저피비알+배당주 집중', '저PER+고배당 기업 위주 장기 보유', NULL, '가치·배당·저평가·장기', 'SAI'),
(9, 'Peter Lynch', '마젤란펀드 매니저. 생활 속 투자법', '생활 속 친근기업 성장주 발굴·매수', NULL, '성장·생활 속 관찰·적극적 탐구', 'ELAI'),
(10, 'Philip Fisher', '성장주의 아버지. 질적 분석 중시', '우수 경영진/제품 성장주를 철저히 조사 후 장기 보유', NULL, '성장·질적 분석·경영진 중시', 'ELAI'),
(11, 'Terry Smith', '펀드스미스 설립자. 20ROCE 초과 성장주 집중', 'ROCE 우량 기업 성장주 장기 보유', NULL, '성장·고ROCE·장기 보유', 'ELPD'),
(12, 'Ron Baron', '바론캐피털 창립자. 장기·성장주 집중', '성장 기업 장기 보유 전략', NULL, '성장·장기·집중', 'ELPI'),
(13, 'Carl Icahn', '행동주의 헤지펀드 투자자. 주주 행동주의 전략', '지분 확보→경영 개선 압박→가치 상승 기대', NULL, '행동주의·지분 확보·경영 개입', 'ESAD'),
(14, 'David Tepper', '앱팔루사 창업자. 경기 순환주/채권 투자', '경기 회복 국면에서 채권/주식 적극 매수', NULL, '경기순환·채권·주식·공격적', 'ESAI'),
(15, 'Bill Miller', '과거 레전드 펀드매니저. 가치+성장 융합', '장기적 저평가 종목+기술주 결합 투자', NULL, '가치+성장·융합형', 'ESPD'),
(16, 'George Soros', '퀀텀펀드 설립. 탑다운형 거시/투기적 투자자', '대규모 단기 매매 전략·통화/비정상적 차익거래 활용', NULL, '탑다운·거시·투기적', 'ESPI');

-- 출석 퀴즈 마스터 (컬럼 순서 주의: question_OX → is_correct)
INSERT INTO attendance_quiz (quizOX_id, question_OX, is_correct) VALUES
(1, 'Java는 플랫폼 독립적인 언어이다.', 1),
(2, 'Spring Boot는 JSP 기반 웹 프레임워크이다.', 0),
(3, 'HTTP GET 요청은 데이터를 서버에 저장한다.', 0),
(4, 'JWT는 JSON 기반의 토큰이다.', 1),
(5, '데이터베이스에서 Primary Key는 중복이 가능하다.', 0),
(6, 'REST API는 상태를 저장하지 않는 Stateless 구조이다.', 1),
(7, 'Linux에서 cd .. 는 현재 디렉토리의 하위 폴더로 이동한다.', 0),
(8, 'Git은 버전 관리를 위한 분산형 시스템이다.', 1),
(9, 'HTML은 프로그래밍 언어이다.', 1),
(10, 'IntelliJ는 Java 개발에 사용되는 대표적인 IDE이다.', 1);

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
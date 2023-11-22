import React from 'react';
import '../styles/MemoAppIntro.css'; // 스타일 파일을 따로 만들어 관리하는 것이 좋습니다.

function MemoAppIntro() {
    return (
        <div className="memo-app-intro-container">
            <div className="memo-app-intro-content">
                <h1>Keep에 오신 것을 환영합니다!</h1>
                <p>
                    Keep은 당신의 생각, 아이디어 및 할 일 목록을 효과적으로 정리하는 데 도움이 되는 간단하고 직관적인 노트 앱입니다.
                </p>
                <ul>
                    <li>🗂 사용자 정의 가능한 태그로 노트를 정리하세요.</li>
                    <li>✏️ 노트를 손쉽게 생성 및 편집하세요.</li>
                    <li>📌 중요한 노트를 빠르게 액세스하기 위해 고정하세요.</li>
                    <li>🗑 노트를 휴지통으로 이동하여 쉽게 관리하세요.</li>
                    <li>🔄 휴지통에서 노트를 복구하거나 영구적으로 삭제하세요.</li>
                </ul>
                <p>
                    지금 시작하고 당신의 모든 일에 대한 동반자로 만들어보세요!
                </p>
            </div>
        </div>
    );
}

export default MemoAppIntro;

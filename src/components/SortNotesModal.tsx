// src/components/SortNotesModal.tsx

import React, { useState } from 'react';

interface SortNotesModalProps {
    onClose: () => void;
    onSort: (sortOption: string) => void; // 추가: 정렬 방법 전달 함수
}

const SortNotesModal: React.FC<SortNotesModalProps> = ({ onClose, onSort }) => {
    const [sortOption, setSortOption] = useState<string>('');

    const handleSort = () => {
        onSort(sortOption); // 추가: 선택한 정렬 방법 전달
        onClose();
    };

    return (
        <div className={'modal'}>
            <div className="modal-content">
                <h2>Sort Notes</h2>
                <button onClick={() => setSortOption('id-desc')}>Sort by ID Desc</button>
                <button onClick={() => setSortOption('id-asc')}>Sort by ID Asc</button>
                <button onClick={() => setSortOption('priority-desc')}>Sort by Priority HighToLow</button>
                <button onClick={() => setSortOption('priority-asc')}>Sort by Priority LowToHigh</button>
                <button onClick={handleSort}>Apply</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default SortNotesModal;

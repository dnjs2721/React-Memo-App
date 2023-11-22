import React, { useState } from 'react';
import '../styles/SortNoteModal.css'

interface SortNotesModalProps {
    onClose: () => void;
    onSort: (sortOption: string) => void; // 수정: 하나의 옵션만 전달
    sortOption: string;
}

const SortNotesModal: React.FC<SortNotesModalProps> = ({ onClose, onSort, sortOption }) => {
    const [selectedOption, setSelectedOption] = useState<string>(sortOption);

    const handleSelectOption = (option: string) => {
        setSelectedOption(option);
    };

    const handleSort = () => {
        onSort(selectedOption);
        onClose();
    };

    return (
        <div className={'sort-modal'}>
            <div className="sort-modal-container">
                <div className={"sort-modal-container-header"}>
                    <div className={"sort-modal-container-header-left"}>
                        <h4>노트 정렬</h4>
                        <button onClick={() => handleSelectOption('')}>CLEAR</button>
                    </div>
                    <button onClick={handleSort} className={"sort-modal-container-header-right"}>X</button>
                </div>
                <div className={"sort-modal-container-values"}>
                    <p>PRIORITY</p>

                    <label>
                        <input
                            type="radio"
                            name="sortOption"
                            value="priority-asc"
                            checked={selectedOption === 'priority-asc'}
                            onChange={() => handleSelectOption('priority-asc')}
                        />
                        Low to High
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="sortOption"
                            value="priority-desc"
                            checked={selectedOption === 'priority-desc'}
                            onChange={() => handleSelectOption('priority-desc')}
                        />
                        High to Low
                    </label>

                    <p>DATE</p>
                    <label>
                        <input
                            type="radio"
                            name="sortOption"
                            value="id-desc"
                            checked={selectedOption === 'id-desc'}
                            onChange={() => handleSelectOption('id-desc')}
                        />
                        Sort by Latest
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="sortOption"
                            value="id-asc"
                            checked={selectedOption === 'id-asc'}
                            onChange={() => handleSelectOption('id-asc')}
                        />
                        Sort by Created
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="sortOption"
                            value="edited"
                            checked={selectedOption === 'edited'}
                            onChange={() => handleSelectOption('edited')}
                        />
                        Sort by Edited
                    </label>
                </div>
            </div>
        </div>
    );
};

export default SortNotesModal;
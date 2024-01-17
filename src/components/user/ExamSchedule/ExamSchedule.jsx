import { Table, } from 'antd';
import React from 'react';
import './ExamSchedule.scss'
import { Button } from 'antd'
import { useState } from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
function ExamSchedule(props) {

    console.log(props.ExamData)

    const columns = [
        {
            title: 'Class id',
            dataIndex: 'subjectId',
            key: 'index',
        },
        {
            title: 'Class',
            dataIndex: 'classId',
            key: 'index',
        },
        {
            title: 'Duration',
            dataIndex: 'examDate',
            key: 'index',
        },
        {
            title: 'Exam Name',
            dataIndex: 'examName',
            key: 'index',
        },
        {
            title: 'Room',
            dataIndex: 'room',
            key: 'index',
        },

    ];
    let mySemester = "";


    let items = props.semesters || []

    const handleSelect = (eventKey) => {
        setSelectedSemester(eventKey);
        if (props?.onSemesterChange)
            props?.onSemesterChange(eventKey)
    };
    const data = props.ExamData || [];

    const [selectedSemester, setSelectedSemester] = useState(items?.length > 0 ? items[0] : "");

    return (
        <>
            <div className='MainContainErExamSchedule'>
                <div className='dropSemester_1'>
                    <Dropdown id='dropSemester_1' onSelect={handleSelect}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {selectedSemester}
                        </Dropdown.Toggle>
                        <Dropdown.Menu >
                            {items.map((item) => (
                                <Dropdown.Item key={item} eventKey={item}>
                                    {item || "place holder"}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                </div>
                <div className='ExamScheduleBoardM'>
                    <Table
                        columns={columns}
                        pagination={{ position: ['none'], }}
                        dataSource={data}
                        bordered
                    />
                </div>

            </div>

        </>

    );
}
export default ExamSchedule;
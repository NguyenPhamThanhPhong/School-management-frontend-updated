import React, { useState, useEffect } from 'react';
import {
    Card,
    Divider,
    Descriptions,
    Space,
    Tabs,
    Avatar,
    message
} from 'antd';
import StudentScoreListTable from '../../../components/Admin/Table/StudentScoreListTable';
import { useStudentContext, setCurrentStudent } from '../../../data-store';
import { useSchoolClassContext } from '../../../data-store';
import ScheduleBoard from '../../../components/user/ScheduleBoard/ScheduleBoard';
import ExamSchedule from '../../../components/user/ExamSchedule/ExamSchedule';



function GenerateItems(id, username, password, email, personalInfo,) {
    return [
        {
            key: '1',
            label: 'Full name',
            children: personalInfo?.name,
        },
        {
            key: '2',
            label: 'MSSV',
            children: id,
        },
        {
            key: '3',
            label: 'Username',
            children: username,
        },
        {
            key: '4',
            label: 'Bậc đào tạo',
            children: personalInfo?.program,
        },
        {
            key: '5',
            label: 'Ngày sinh:',
            children: personalInfo?.dateofBirth,
        },
        {
            key: '6',
            label: 'Faculty',
            children: personalInfo?.facultyId,
        },
        {
            key: '7',
            label: 'Program',
            children: personalInfo?.program,
        },
        {
            key: '8',
            label: 'Giới tính',
            children: personalInfo?.gender,
        },
        {
            key: '9',
            label: 'Phone',
            children: personalInfo?.phone,
        },
    ]
}


function DetailStudent() {

    const [studentState, studentDispatch] = useStudentContext();
    const [schoolClassState, schoolClassDispatch] = useSchoolClassContext();

    let currentStudent = studentState?.currentStudent;
    let schoolClasses = schoolClassState?.schoolClasses || [];

    const [schedule, setSchedule] = useState(schoolClassState?.schoolClasses || []);
    const [examSchedule, setExamSchedule] = useState([]);

    const items = [
        {
            key: '1',
            label: 'Name',
            children: currentStudent?.personalInfo?.name,
        },
        {
            key: '2',
            label: 'Id',
            children: currentStudent?.id,
        },
        {
            key: '3',
            label: 'Gender',
            children: currentStudent?.personalInfo?.gender,
        },
        {
            key: '4',
            label: 'Username',
            children: currentStudent?.username,
        },
        {
            key: '5',
            label: 'Password',
            children: currentStudent?.password,
        },
        {
            key: '6',
            label: 'Email',
            children: currentStudent?.email,
        },
        {
            key: '7',
            label: 'Faculty',
            children: currentStudent?.personalInfo?.facultyId,
        },
        {
            key: '8',
            label: 'Program',
            children: currentStudent?.personalInfo?.program,
        },
        {
            key: '9',
            label: 'Khoa',
            children: currentStudent?.personalInfo?.dateOfBirth,
        },
    ];

    function getScheduleBySemester(semesterId) {

        let filtredSchoolClasses = schoolClasses.filter(item => item.semesterId === semesterId);
        let filteredSchedule = filtredSchoolClasses.map(
            (item) => {
                let schedule = {
                    id: item.id,
                    title: `${item.name} (${item.id})`,
                    daysOfWeek: item.schedule?.dateofweek + '',
                    startTime: item.schedule?.startTime,
                    endTime: item.schedule?.endTime,
                    extendedProps: {
                        id: `${item.name} (${item.id})`,
                        beginTime: '20/11/2023',
                        finalTime: '20/12/2023'
                    }
                }
                return schedule;
            }
        )
        setSchedule(filteredSchedule);
    }
    function selectSemesterInClassList(classList) {
        if (currentStudent?.classes) {
            let filteredClassList = classList.filter(item => currentStudent?.classes.includes(item.id));
            let semesters = filteredClassList.map(item => item.semesterId);
            let uniqueSemesters = [...new Set(semesters)];
            return uniqueSemesters;
        }
    }

    function getExamBySemester(semesterId) {
        let filtredSchoolClasses = schoolClasses.filter(item => item.semesterId === semesterId);
        let examRows = [];
        for (const schoolClass of filtredSchoolClasses) {
            if (schoolClass) {
                for (const exam of schoolClass.exams) {
                    if (exam) {
                        examRows.push({
                            key: examRows.length + 1,
                            index: examRows.length + 1,
                            subjectId: `${schoolClass?.subject?.id} - ${schoolClass?.subject?.name} ` || '',
                            classId: `${schoolClass?.id} + ${schoolClass?.name}` || '',
                            examName: exam?.name || '',
                            room: exam?.room || '',
                            examDate: exam?.dateString,
                        })
                    }
                }
            }
        }
        setExamSchedule(examRows);
    }



    const itemtab = [
        {
            key: '1',
            label: 'Score',
            children: <StudentScoreListTable creditLogs={studentState?.currentStudent?.creditLogs} />,
        },
        {
            key: '2',
            label: 'Schedule',
            children: <ScheduleBoard semesters={selectSemesterInClassList(schoolClassState?.schoolClasses)} ScheduleEvents={schedule}
                onSemesterChange={getScheduleBySemester}></ScheduleBoard>,
        },
        {
            key: '3',
            label: 'Lịch thi',
            children: <ExamSchedule
                semesters={selectSemesterInClassList(schoolClassState?.schoolClasses)}
                onSemesterChange={getExamBySemester}
                ExamData={examSchedule}></ExamSchedule>,
        },
    ];
    const renderDescriptions = () => {
        return <Descriptions bordered items={items} />;
    };
    return (
        <div>
            <Card>
                <Divider style={{ color: 'blue', fontSize: '16px' }}>Thông tin sinh viên</Divider>
                <Space
                    style={{ width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                >
                    <Avatar
                        size={240}
                        bordered={true}
                        src={currentStudent?.personalInfo?.avatarUrl}
                    />
                    {renderDescriptions()}
                </Space>
                <Tabs
                    defaultActiveKey="1"
                    tabBarStyle={{ margin: '0 auto' }}
                    items={itemtab}
                    size="large"
                />
            </Card>
        </div>
    );
}

export default DetailStudent;

import React, { useEffect, useState } from 'react';
import {
    Card,
    Table,
    Divider,
    Descriptions,
    Badge,
    Breadcrumb,
    Button,
    Space,
    Calendar,
    Tabs,
    Avatar,
    Input,
} from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined } from '@ant-design/icons';
import LecturerExamListTable from '../../../components/Admin/Table/LecturerExamListTable';
import ScheduleBoard from '../../../components/user/ScheduleBoard/ScheduleBoard';

import { useLecturerContext, useSchoolClassContext } from '../../../data-store';
import { DateOfWeek } from '../../../data-api';

const scoreListData = [
    {
        ID: 'Se001',
        name: 'Lap trinh',
        progress: '9',
        midtearn: '9',
        practice: '9',
        final: '9',
        GPA: '9',
    },
    {
        ID: 'Se002',
        name: 'Lap trinh',
        progress: '9',
        midtearn: '9',
        practice: '9',
        final: '9',
        GPA: '9',
    },
];




const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'id' },
    { title: 'Schedule', dataIndex: 'schedule', key: 'id' },
];

function DetailLecturer() {
    const [lecturerState, lecturerDispatch] = useLecturerContext();
    const [schoolClassState, schoolClassDispatch] = useSchoolClassContext();

    let currentLecturer = lecturerState?.currentLecturer;
    let schoolClasses = schoolClassState?.schoolClasses || [];

    const [schedule, setSchedule] = useState(schoolClassState?.schoolClasses || []);

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
        if (currentLecturer?.classes) {
            let filteredClassList = classList.filter(item => currentLecturer?.classes.includes(item.id));
            let semesters = filteredClassList.map(item => item.semesterId);
            let uniqueSemesters = [...new Set(semesters)];
            return uniqueSemesters;
        }
    }

    function logicDisplayClasses() {
        if (schoolClassState.schoolClasses.length > 0) {
            let filteredClasses = schoolClassState.schoolClasses.filter((schoolClass) => currentLecturer?.classes?.includes(schoolClass.id));
            let result = filteredClasses.map((schoolClass) => {
                return {
                    key: schoolClass.id,
                    id: schoolClass.id,
                    name: schoolClass.name,
                    schedule:
                        DateOfWeek.GetDateOfWeek(schoolClass?.schedule.dateofweek) + ' ' +
                        (schoolClass?.schedule.startTime || '') + ' - ' + schoolClass?.schedule.endTime
                }
            });
            return result;
        }
        return [];
    }

    const items = [
        {
            key: '1',
            label: 'Name',
            children: currentLecturer?.personalInfo?.name,
        },
        {
            key: '2',
            label: 'Id',
            children: currentLecturer?.id,
        },
        {
            key: '3',
            label: 'Gender',
            children: currentLecturer?.personalInfo?.gender,
        },
        {
            key: '4',
            label: 'Username',
            children: currentLecturer?.username,
        },
        {
            key: '5',
            label: 'Password',
            children: currentLecturer?.password,
        },
        {
            key: '6',
            label: 'Email',
            children: currentLecturer?.email,
        },
        {
            key: '7',
            label: 'Faculty',
            children: currentLecturer?.personalInfo?.facultyId,
        },
        {
            key: '8',
            label: 'Program',
            children: currentLecturer?.personalInfo?.program,
        },
        {
            key: '9',
            label: 'Khoa',
            children: currentLecturer?.personalInfo?.dateOfBirth,
        },
    ];

    const itemtab = [
        {
            key: '1',
            label: 'Assigned classes',
            children: <Table dataSource={logicDisplayClasses()} columns={columns} pagination={false} />,
        },
        {
            key: '3',
            label: 'Schedule',
            children: <ScheduleBoard semesters={selectSemesterInClassList(schoolClassState?.schoolClasses)} ScheduleEvents={schedule}
                onSemesterChange={getScheduleBySemester}></ScheduleBoard>,
        },
    ];
    return (
        <div>
            <Card>
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <a href="/admin/lecturer" className="breadcrumb-link">
                                    Back to Lecturer page
                                </a>
                            ),
                        }
                    ]}
                />
                <Divider style={{ color: 'blue', fontSize: '16px' }}>Thông tin giảng viên</Divider>
                <Space
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Avatar
                        size={240}
                        bordered={true}
                        src={currentLecturer?.personalInfo?.avatarUrl}
                    />

                    <Descriptions bordered items={items} />
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

export default DetailLecturer;

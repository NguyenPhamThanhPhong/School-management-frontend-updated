import React, { useEffect, useState } from 'react';
import { Space, Button, Input, Select, Card, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import CreateLecturerModal from '../../../components/Admin/Modal/CreateLecturerModal';
import SendNotiLecturerModal from '../../../components/Admin/Modal/SendNotiLecturerModal';
import ShowLecturerDrawer from '../../../components/Admin/Drawer/ShowLecturerDrawer';
import LecturerTable from '../../../components/Admin/Table/LecturerTable';


import { useLecturerContext, setLecturers, useFacultyContext, setStudents, removeLecturer } from '../../../data-store';
import { lecturerApi } from '../../../data-api/lecturer-api';


const { Search } = Input;
const { Option } = Select;

const Lecturer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [lecturerState, lecturerDispatch] = useLecturerContext();

    const [filtredLecturers, setFiltredLecturers] = useState(lecturerState.lecturers);
    const [searchText, setSearchText] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState(null);

    const fetchLecutrers = async (start, end) => {
        try {
            let response = await lecturerApi.getManyRange(start, end)
            if (!response.isError) {
                lecturerDispatch(setLecturers(response.data.data));
            }
            else
                console.log(response.data)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        document.title = 'Quản lý giảng viên';
        fetchLecutrers(0, 50);
    }, []);


    const onSearch = () => {
        if (lecturerState !== null && lecturerState !== undefined) {
            let result = lecturerState.lecturers.filter((lecturer) => {
                let search = searchText.toLowerCase();
                search = search.replace(/\s/g, '').replace(/[^\w\s]/g, '');
                let name = lecturer?.personalInfo?.name?.toLowerCase();
                name = name.replace(/\s/g, '').replace(/[^\w\s]/g, '');
                let id = lecturer?.id?.toLowerCase();
                id = id.replace(/\s/g, '').replace(/[^\w\s]/g, '');
                return lecturer.personalInfo?.facultyId?.includes(selectedFaculty || "") && (name.includes(search) || id.includes(search));
            })
            setFiltredLecturers(result);
        }
    }

    useEffect(() => {
        onSearch();
    }, [selectedFaculty, searchText])

    const handleDetail = (record) => {
        setSelectedStudent(record);
        setIsDetailDrawerOpen(true);
    };

    const showNotificationModal = () => {
        setIsOpen(true);
    };

    const showCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleNotificationModalOk = () => {
        setIsOpen(false);
    };

    const handleNotificationModalCancel = () => {
        setIsOpen(false);
    };

    const handleCreateModalOk = () => {
        setIsCreateModalOpen(false);
    };

    const handleCreateModalCancel = () => {
        setIsCreateModalOpen(false);
    };

    const handleSendNotification = () => {
        showNotificationModal();
    };

    const handleCreate = () => {
        showCreateModal();
    };
    const closeDrawer = () => {
        setIsDetailDrawerOpen(false);
    };

    return (
        <div>
            <Card>
                <div>
                    <h5>Quản lý giảng viên</h5>
                </div>
                <Space style={{ marginBottom: 16 }}>
                    <Select style={{ width: 150 }} placeholder="Select Khoa">
                        <Option value="K42">K42</Option>
                        <Option value="K43">K43</Option>
                    </Select>
                    <Search
                        placeholder="Search..."
                        onSearch={(value) => console.log(value)}
                        style={{ width: 200 }}
                        prefix={<SearchOutlined />}
                    />
                    <Button type="primary" onClick={handleSendNotification}>
                        Gửi thông báo
                    </Button>
                    <Button type="primary" onClick={handleCreate}>
                        Thêm mới
                    </Button>
                </Space>
                <LecturerTable lecturers={filtredLecturers} handleDetail={handleDetail} />
            </Card>
            <SendNotiLecturerModal
                open={isOpen}
                onOk={handleNotificationModalOk}
                onCancel={handleNotificationModalCancel}
            />
            <CreateLecturerModal
                open={isCreateModalOpen}
                onOk={handleCreateModalOk}
                onCancel={handleCreateModalCancel}
            />
            <ShowLecturerDrawer onClose={closeDrawer} open={isDetailDrawerOpen} selectedStudent={selectedStudent} />
        </div>
    );
};

export default Lecturer;

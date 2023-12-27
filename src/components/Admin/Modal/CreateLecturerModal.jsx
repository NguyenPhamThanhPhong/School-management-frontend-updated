import React from 'react';
import { Modal, Form, Input } from 'antd';
import { useState } from 'react';

import { lecturerApi, SchoolMemberCreateRequest, PersonalInfo } from '../../../data-api/index';


function CreateLecturerModal({ open, onOk, onCancel }) {

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [faculty, setFaculty] = useState('');

    const createData = async (data) => {
        try {
            var response = await lecturerApi.lecturerCreate(data);
            if (!response.isError) {
                console.log(response.data)
            }
            else {
                console.log(response.data)
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleOk = async () => {
        console.log('making api creation')
        console.log(id, name, birthday, email, phone, faculty)
        const personalInfo = new PersonalInfo(birthday, name, 'male', phone, 'CLC')
        const data = new SchoolMemberCreateRequest(id, id, '123', email, 'lecturer', personalInfo, []);

        console.log(JSON.stringify(data))

        createData(data);

    }



    return (
        <Modal title="Tạo sinh viên" open={open} onOk={handleOk} onCancel={onCancel}>
            <Form>
                <Form.Item label="MSSV">
                    <Input value={id} onChange={(event) => setId(event.target.value)} />
                </Form.Item>
                <Form.Item label="Tên">
                    <Input value={name} onChange={(event) => setName(event.target.value)} />
                </Form.Item>
                <Form.Item label="Ngày sinh">
                    <Input value={birthday} onChange={(event) => setBirthday(event.target.value)} />
                </Form.Item>
                <Form.Item label="Email">
                    <Input value={email} onChange={(event) => setEmail(event.target.value)} />
                </Form.Item>
                <Form.Item label="Số điện thoại">
                    <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
                </Form.Item>
                <Form.Item label="Faculty">
                    <Input value={faculty} onChange={(event) => setFaculty(event.target.value)} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CreateLecturerModal;

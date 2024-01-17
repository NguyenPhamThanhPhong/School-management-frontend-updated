import './Home.css'
import NotificationList from "../../../components/user/NotificationList/NotificationList";
import { Tabs } from 'antd';
import { usePostContext, useUserContext } from '../../../data-store';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { executeLogout } from '../../../data-store';

const onChange = (key) => {
  console.log(key);
};

//

function Home() {

  const [postState, postActions] = usePostContext();
  const [userState, userDispatch] = useUserContext();

  const [facultyPost, setFacultyPost] = useState([]);
  const [generalPost, setGeneralPost] = useState([]);
  const [yourPost, setYourPost] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    if (postState?.posts !== undefined && postState?.posts !== null && userState?.user !== undefined && userState?.user !== null) {
      let facultyId = userState?.user?.personalInfo?.facultyId;
      setFacultyPost(postState?.posts?.filter(item => item.facultyTags.includes(facultyId)));
      setGeneralPost(postState?.posts);
      setYourPost(postState?.posts);
    }
  }, [postState?.posts]);


  const items = [
    {
      key: '1',
      label: 'General notification',
      children: <NotificationList NotiType={'General notification'} NotificationItems={generalPost}></NotificationList>,
    },
    {
      key: '2',
      label: 'Faculty notification',
      children:
        <NotificationList NotiType={'Faculty notification'} NotificationItems={facultyPost}>
        </NotificationList>,
    },
  ];

  return (
    <>
      <div className="homeMain">
        <Tabs className='TabsPosition' defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </>
  );
}

export default Home;

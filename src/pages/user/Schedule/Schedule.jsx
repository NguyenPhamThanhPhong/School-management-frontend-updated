import ScheduleBoard from "../../../components/user/ScheduleBoard/ScheduleBoard";
import ExamSchedule from "../../../components/user/ExamSchedule/ExamSchedule";

import { Tabs, message } from 'antd';
import './Schedule.scss'
import { useState, useEffect } from 'react';

import { useUserContext, useSchoolClassContext, useSemesterContext } from '../../../data-store';


const onChange = (key) => {
  console.log(key);
};
//


function Schedule() {

  const [userState, userDispatch] = useUserContext();
  const [schoolClassState, schoolClassDispatch] = useSchoolClassContext();
  const [semesterState, semesterDispatch] = useSemesterContext();

  let user = userState?.user || {};


  const [schoolClasses, setSchoolClasses] = useState(schoolClassState?.schoolClasses || []);
  const [schedule, setSchedule] = useState(schoolClassState?.schoolClasses || []);
  const [examSchedule, setExamSchedule] = useState([]);


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
    if (user?.classes) {
      let filteredClassList = classList.filter(item => user?.classes.includes(item.id));
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
              examDate: `${exam?.startTime} + ${exam?.duration}` || '',
            })
          }
        }
      }
    }
    setExamSchedule(examRows);
  }




  const items = [
    {
      key: '1',
      label: 'Schedule',
      children: <ScheduleBoard semesters={selectSemesterInClassList(schoolClassState?.schoolClasses)} ScheduleEvents={schedule}
        onSemesterChange={getScheduleBySemester}></ScheduleBoard>,
    },
    {
      key: '2',
      label: 'Exam schedule',
      children: <ExamSchedule
        semesters={selectSemesterInClassList(schoolClassState?.schoolClasses)}
        onSemesterChange={getExamBySemester}
        ExamData={examSchedule}></ExamSchedule>,
    },
  ];


  if (userState?.user?.role === 'lecturer') {
    items.splice(1, 1)
  }

  return (
    <>
      <div className="MainScreenSchedule">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </>
  );

}

export default Schedule;
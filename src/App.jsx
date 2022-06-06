import './App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "./firebase";
import { collection, query, onSnapshot, addDoc,where } from "firebase/firestore";

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import List from '@mui/material/List';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField'
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';


import AnniversaryItem from './AnniversaryItem'




const App = (props) => {
  // 認証の状態管理
  const [user, loading, password] = useAuthState(auth);
  // firestoreから取得したデータ
  const [tasks, setTasks] = useState([{ id: "", title: "",date:"" }]);
  // 記念日のtextarea
  const [input, setInput] = useState("");
  // 日付の入力のカレンダー
  const [date, setDate] = useState(null);
  // カレンダーの選択を反映させる関数
  const changeDateHandler = (newDate) => {
    setDate(newDate)
  }

  const navigate = useNavigate()

  const fetchUserAnniversary = async () => {
    try {
      const q = query(collection(db, "anniversaries"), where("uid", "==", user?.uid));
      const unsub = onSnapshot(q, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          date:doc.data().date
        }))
      );
      });
      return () => unsub();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/")
    fetchUserAnniversary();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user, loading])

  const newTask = async (e) => {
    //Firebase ver9 compliant (modular)
    await addDoc(collection(db, "anniversaries"), { title: input,date:date,uid:user.uid });
    setInput("");
  };
  return (
    <div>
      <h1>あなたの記念日</h1>
      <LogoutIcon
        onClick={()=>logout()}
      />

      <br/>
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="何の記念日?"
          value={input}
          onChange={(e) => setInput(e.target.value)
          }
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ m: 2, width: '25ch' }}>
            <DatePicker
              label="DatePicker"
              value={date}
              onChange={changeDateHandler}
              inputFormat='yyyy/MM/dd'
              mask='____/__/__'
              renderInput={(params)=><TextField{...params}/>}
            />
          </Box>
        </LocalizationProvider>
      </FormControl>
      <AddIcon
          disabled={!input} onClick={newTask}
      />
      
      <List>
        {tasks.map((item) => (
          <AnniversaryItem key={item.id} id={item.id} title={item.title} date={item.date}/>
      ))}
      </List>
    </div>
  );
}


export default App;

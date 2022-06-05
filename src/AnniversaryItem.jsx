// rafce
import React, { useState } from 'react';

import ListItem from '@mui/material/ListItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";

import { db } from "./firebase";
//Firebase ver9 compliant (modular)
import { doc, collection, setDoc, deleteDoc } from "firebase/firestore";


function convertTimestampToDatetime(timestamp) {
  const _d = timestamp ? new Date(timestamp * 1000) : new Date();
  const Y = _d.getFullYear()-1969;
  const m = (_d.getMonth() + 1).toString().padStart(2, "0");
  const d = _d.getDate().toString().padStart(2, "0");
  const H = _d.getHours().toString().padStart(2, "0");
  const i = _d.getMinutes().toString().padStart(2, "0");
  const s = _d.getSeconds().toString().padStart(2, "0");
    return `${Y}/${m}/${d}`;
    // return `${Y}/${m}/${d} ${H}:${i}:${s}`;
}

const AnniversaryItem = (props) => {
    const [title, setTitle] = useState(props.title);
    const [date, setDate] = useState(props.date);

    const anniversariesRef = collection(db, "anniversaries");
    const editAnniversary = async () => {
        //Firebase ver9 compliant (modular)
        await setDoc(
        doc(anniversariesRef, props.id),
        {
            title: title,
        },
        { merge: true }
        );
    };

    const deleteAnniversaries = async () => {
        //Firebase ver9 compliant (modular)
        await deleteDoc(doc(anniversariesRef, props.id));
    };

  return (
    
    <ListItem>
          <p>{props.title}</p>
          <p>{convertTimestampToDatetime(props.date)}</p>
          <Grid container justifyContent="flex-end">
              <TextField
                  InputLabelProps={{
                      shrink:true,
                  }}
              
                  label="編集"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
              />
          </Grid>
          <EditIcon
              onClick={editAnniversary}
          />
          <DeleteIcon
              onClick={deleteAnniversaries}
          />
    </ListItem>
    
  )
}

export default AnniversaryItem

/*
  내가 못한 것
  1. total 금액 출력 못했음.    <<< OK
  2. data.json에 fetch로 데이터 심어줘야하는데 못했음.    <<< OK.
*/

import './App.css';
import { useRef, useState } from 'react';


// json 서버 키는법
// npx json-server --watch ./src/data.json --port 3010

function App() {
  const [data, setData] = useState([]);
  const [popup, setPopup] = useState(false);

  return (
    <div className='wrap'>
      <Insert setData={setData} popup={popup} setPopup={setPopup} />
      <List data={data} popup={popup} setPopup={setPopup} />
    </div>
  )
}


function Insert({setData, popup, setPopup}){
  let amountRef = useRef();
  let noteRef = useRef();
  let inBtn = useRef();
  let outBtn = useRef();
  const [btn, setBtn] = useState('');

  
  let update = (e) => {
    e.preventDefault();
    
    let amount = amountRef.current.value;
    let note = noteRef.current.value;
    let newDate = new Date(Date.now())
    let year = newDate.getFullYear()
    let month = newDate.getMonth()+1
    let date = year + ". " + month
    let type = '';
      if(btn == 'in') {
      type = inBtn.current.value;
    } else if (btn == 'out') {
      type = outBtn.current.value;
    }

    fetch('http://localhost:3010/bank', {
        method: 'post',
        body: JSON.stringify({id:Date.now(), amount, note, type, date})
    })
    setData((d)=>{
      // ...d가 알갱이 이니까 []로 감싸주고, 추가하는것들은 알맹이니깐 {}로 감싸준거임.
      return [...d, {id:Date.now(), amount, note, type, date}]
    })
    e.target.reset()
  }

  return(
    <div className={`popup ${popup ? 'on' : ''}`}>
      <div className='top'>
        <h2>등록하기</h2>
        <button id='closeBtn' onClick={() => {setPopup(false)}}>닫기</button>
      </div>
      <div className='input-wrap'>
        <form id='form' onSubmit={update}>
          <div className='inputs'>
            <input type='text' placeholder='금액' ref={amountRef} />
            <input type='text' placeholder='메세지' ref={noteRef} />
          </div>
          <div className='btns'>
            <input type='submit' ref={inBtn} value={'입금'} onClick={()=>{setBtn('in')}}/>
            <input type='submit' ref={outBtn} value={'출금'} onClick={()=>{setBtn('out')}}/>
          </div>
        </form>
      </div>
    </div>

  )
}

function List({data, popup, setPopup}) {
  let total = 0;
  let listItem = data.map((obj)=>{
    if(obj.type === '입금') {
      total += parseInt(obj.amount)
    } else if(obj.type === '출금') {
      total -= parseInt(obj.amount)
    }

    return (
      <li key={obj.id} className={`${obj.type === '입금' ? 'in' : ''} ${obj.type === '출금' ? 'out' : ''}`}>
        <p className='date'>{obj.date}</p>
        <p className='note'>{obj.note}</p>
        <p className='in-or-out'>{obj.type}</p>
        <p className='amount'>{obj.amount}</p>
      </li>
    )
  })

  return (
    <div className='box'>
      <button id='plusBtn' onClick={()=>{setPopup(!popup)}}>+</button>
      <h1>
        2023년 입출금 내역
        <span>{total}</span>
      </h1>
      <ul>
        {listItem}
      </ul>
    </div>
  );
}

export default App;

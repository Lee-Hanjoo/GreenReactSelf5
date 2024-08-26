import axios from 'axios';
import './App.css';
import React,{useState, useMemo, useEffect} from 'react'


// json 서버 키는법
// npx json-server --watch ./src/data.json --port 3030
function App() {
    const [data,setData] = useState([]);
  
    // 브라우저 켰을 때, 최초 한번은 가지고 와야함.
    useEffect(()=>{
        axios.get('http://localhost:3030/details')
        .then((res)=>{  
            setData(res.data)
        })
    },[])

    return (
      <div className="bank">
        <List data={data} />
        <Insert setData={setData} />
      </div>
  );
}

function List({data}){
   
    
    let itemTag = data.map((item)=>{
        
        let date = {
            // {} 오브젝트는 속성 : 값 으로 해야한다. 값에 펑션을 넣어도 된다.
            d : new Date(item.id),
            print:function(){
                return this.d.getMonth() + 1 + '월 ' + this.d.getDate() + '일';
            }
        };
        
        let year = date.d.getFullYear()
        // let month = date.getMonth() + 1
        // 위에 let ~하고 , 리턴을 한 곳에서 하고싶으면 중괄호로 감샂귀.
        return(
            <li key={item.id}>
                <span>{year}년 {date.print()}</span>
                <span>{item.msg}</span>
                <span>{item.type}</span>
                <span>{item.money}원</span>
            </li>
        )
    })

  return(
    <div className="details">
      <h2>
        <small>2024년 입출금 내역</small>       
      </h2>
      <ul>
        {itemTag}
      </ul>
    </div>
  )
}


function Insert({setData}){

    // ...info, money:'' << 속성 이름이 같으면 덮어쓰기되고, 다르면 추가가 됨.
    const [info, setInfo] = useState({money:'', msg:''})


    let changeData = (e) => {
        // 변수는 속성으로 들어갈 수 없음. []로 감싸줘야 들어감.
        let property = e.target.name;
        let value = e.target.value
        setInfo({...info, [property]:value})
        
    }
    
    let addData = (type) => {
        // axios.get("http://localhost:3030/details")
        // .then(res=>console.log(res.data))
        // // 에러가 났을 땐 catch
        // .catch((e)=>{console.log('error')})
        let id = Date.now();
        let datas = {id, type, ...info};

        axios.post("http://localhost:3030/details", datas)

        setInfo({money:'', msg:''})
        setData(d=> [...d, datas])
    }

  return(
    <div className="insert">
        <h2>등록하기</h2>
        <div>
            {/* onChange={(e)=>addData(e)} 는 e를 받아서 매개변수로 e를 넘겨줘야 이벤트가 들어감.*/}
            {/* onChange={addData}는 매개변수 안써도 e 바로 쓸 수있음.  */}
            <input  type="text" name="money" value={info.money} onChange={changeData}/>
            {/* input은 한줄 밖에 안됨. 여러줄 하려면 textarea. */}
            <textarea name="msg" value={info.msg} onChange={changeData}></textarea>
            <button onClick={(e)=>addData('예금')}>예금하기</button>
            <button onClick={(e)=>addData('출금')}>출금하기</button>
        </div>
    </div>
  )
}
export default App;

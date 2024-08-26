import './App.css';
import React,{useState, useMemo} from 'react'


// json 서버 키는법
// npx json-server --watch ./src/data.json --port 3030
function App() {
  const [data,setData] = useState([]);
  return (
    <div className="bank">
     
      <List data={data}/>
      <Insert setData={setData}/>
    </div>
  );
}

function List({data}){
  
  //item생성
  let listTag = data.map((obj)=>{

    let date = {
      d:new Date(obj.id),
      p:function(){
        let m=this.d.getMonth()+1,
            d=this.d.getDate();
        return `${m}.${d}`
      }
    };
    
    return <li key={obj.id} className={obj.type==='출금'?'active':''}>
      <span>{date.p()} {obj.msg}</span>
      <span>{obj.type}</span>
      <span>{obj.money}</span>
    </li>
  })

  if(!data.length)return<></>;

  return(
    <div className="details">
      <h2>
        <small>2024년 입출금 내역</small>       
      </h2>
      <ul>
      {listTag}
      </ul>
    </div>
  )
}

function Insert({setData}){

  let [info,setInfo] = useState({money:0,msg:''});

  let v = {
      changeData : (e)=>{
        let property = e.target.name;
        let value = e.target.value;
        setInfo({...info, [property]:value})
      },
      
      addData : (e,type)=>{
        e.preventDefault();

        let id = Date.now();

        fetch('http://localhost:3030/details',{
          method:"post",
          body:JSON.stringify({id, type, ...info})
        })
        
        setData((d)=>[...d,{id, type, ...info}])
      }
  }

  return(
    <div className="insert">
      <h2>등록하기</h2>
      <form >
        <div>
          <input  type="text" name="money" onChange={v.changeData}/>
          <textarea name="msg" onChange={v.changeData}></textarea>
          <button onClick={(e)=>v.addData(e,'예금')}>예금하기</button>
          <button onClick={(e)=>v.addData(e,'출금')}>출금하기</button>
        </div>
      </form>
    </div>
  )
}
export default App;

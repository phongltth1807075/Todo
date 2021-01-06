import React, { useEffect, useState } from "react";
import './Todo.css';
import axios from "axios";
import { TodoInterface } from "../service/model/todo";
// import { Account } from "../service/model/account";

function Todo() {

    const [toDos, setToDos] = useState<TodoInterface[]>([]);
    const [list, setList] = useState<TodoInterface[]>([]);
    const [toDosOther, setToDosOther] = useState<TodoInterface[]>([]);
    const [toDo, setTodo] = useState<TodoInterface>({ id: '', name: '', type: '', status: false, date: '' });
    const [validate, setValidate] = useState({ name: '', date: '' })
    const url = 'http://localhost:8080/todo';
    let interval: any;

    useEffect(() => {
        getTodo();
    }, []);

    useEffect(() => {
        interval = setInterval(informationDate, 1000)
        return () => clearInterval(interval)
    }, [toDos])

    const getTodo = async () => {
        try {
            let result = await axios.get(url, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            // @ts-ignore
            setToDosOther(result.data.data.filter(x => x.status === true));
            // @ts-ignore
            setToDos(result.data.data.filter(x => x.status === false));
            setList(result.data.data);
        } catch {

        }
    };

    const informationDate = async () => {
        try {
            // @ts-ignore
            let now = moment(new Date());
            let arr = toDos.filter(x => x.type !== "true");
            for (let index = 0; index < arr.length; index++) {
                let formatDate = new Date(arr[index].date);
                // @ts-ignore
                let then = moment(formatDate);
                let timeDifferenceInSeconds = then.diff(now, 'seconds');
                if (timeDifferenceInSeconds < 900) {
                    let a = toDos.find(x => x.id === arr[index].id)
                    let value = { ...a, type: "true" }
                    console.log(a);
                    if (value !== null) {
                        console.log(value)
                        await axios.post(url, value);
                        getTodo();
                    }
                }
            }
        } catch (error) {
            alert(error)
        }
    }

    const valueFormAddTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value.length>0){
            setValidate({
                name:'',
                date:''
            })
        }
        const { name, value } = e.target;
        setTodo({ ...toDo, [name]: value });
    };

    const submitAdd = async () => {
        if (toDo.name.length <= 0 && toDo.date.length <= 0) {
            setValidate({ name: '*required', date: '*required' })
        } else if (toDo.name.length <= 0) {
            setValidate({
                date: '', name: '*required'
            })
        } else if (toDo.date.length <= 0) {
            setValidate({
                name: '', date: '*required'
            })
        } else {
            try {
                await axios.post(url, toDo);
                alert('Success');
                setTodo({ id: '', name: '', type: 'false', status: false, date: '' })
                setValidate({ name: '', date: '' })
                getTodo();
                informationDate();
            } catch (error) {
                alert('Err')
            }
        }
    };

    const deleteTodo = async (item: TodoInterface) => {
        try {
            await axios.delete(url + '/' + item.id);
            alert("Success");
            getTodo();
            informationDate();
        } catch (error) {
            alert("Err")
        }

    };

    const changeStatus = async (e: React.ChangeEvent<HTMLInputElement>, item: TodoInterface) => {
        try {
            let a = list.find(x => x.id === item.id)
            if (a !== null) {
                const value = { ...a, status: e.target.checked }
                await axios.put(url + '/' + item.id, value);
                alert("Success");
                getTodo();
                informationDate();
            }
        } catch {
            alert("Err")
        }
    };

    const getTextSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        let array = list;
        setToDos(array.filter(x => x.status !== true && x.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())));
        setToDosOther(array.filter(x => x.status === true && x.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())));
    }

    const updateTodo = (item: TodoInterface) => {
        setTodo({
            id: item.id,
            name: item.name,
            type: item.type,
            status: item.status,
            date: item.date,
        })
    };

    return (
        <div className="Todo">
            <div className="container">
                <h2>TODO LIST</h2>
                <h3>Search</h3>
                <input style={{ marginTop: 10 }} type="text" onChange={(e) => getTextSearch(e)} className="form-control" placeholder="Search" />
                <h3>Add Item</h3>
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                    Add
                </button>
                <h3>Todo</h3>
                <ul id="incomplete-tasks">
                    {toDos !== null ?
                        toDos.map((item: TodoInterface, index: number) => {
                            return (
                                <li key={index}>
                                    <input onChange={(e) => changeStatus(e, item)}
                                        type="checkbox" checked={item.status} />
                                    <label className={item.type === 'true' ? 'red' : 'black'}>{item.name}</label>
                                    <input
                                        type="text"
                                        defaultValue="Go Shopping" />
                                    <button data-toggle="modal" onClick={() => updateTodo(item)}
                                        data-target="#exampleModal" className="edit">Edit
                                    </button>
                                    <button className="delete" onClick={() => deleteTodo(item)}>Delete</button>
                                </li>
                            );
                        }) :
                        null
                    }
                </ul>
                <h3>Completed</h3>
                <ul id="completed-tasks">
                    {toDosOther !== null ?
                        toDosOther.map((item, index) => {
                            return (
                                <li key={index}>
                                    <input checked={item.status} onChange={(e) => changeStatus(e, item)} type="checkbox" /><label>{item.name}</label><input type="text"
                                        defaultValue="Go Shopping" />
                                    <button data-toggle="modal" onClick={() => updateTodo(item)}
                                        data-target="#exampleModal" className="edit">Edit
                                    </button>
                                    <button className="delete" onClick={() => deleteTodo(item)}>Delete</button>
                                </li>
                            );
                        }) :
                        null
                    }
                </ul>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog"
                aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Form Add Todo</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">DateLine</label>
                                <input type="datetime-local" value={toDo.date} onChange={valueFormAddTodo} name={'date'}
                                    className="form-control" placeholder="DateLine" />
                                <span style={{ color: "red" }}>{validate.date}</span>
                                {/*<small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>*/}
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Name</label>
                                <input type="" name={'name'} value={toDo.name} onChange={valueFormAddTodo}
                                    className="form-control"
                                    id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                                <span style={{ color: "red" }}>{validate.name}</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" onClick={submitAdd} className="btn btn-primary">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Todo;

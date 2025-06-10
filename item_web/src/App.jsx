import { useState } from 'react'
import './App.css'
import {useTable, useGlobalFilter, useSortBy, usePagination} from 'react-table'
import * as React from 'react';
import axios from 'axios';

function App() {
const [items, setItems] = useState([]);
const columns = React.useMemo(() => [
  { Header: 'ItemID', accessor: 'item_id' },
  { Header: 'Name', accessor: 'name' },
  { Header: 'Description', accessor: 'description' },
  { Header: 'Price', accessor: 'price' },
  { Header: "Edit", id: "Edit", accessor: "edit", Cell: (props) => (<button className="editBtn" onClick={() => handleEdit(props.cell.row.original)}>Edit</button>) },
  { Header: "Delete", id: "Delete", accessor: "delete", Cell: (props) => (<button className="deleteBtn" onClick={() => handleDelete(props.cell.row.original)}>Delete</button>) }

], []);

const data = React.useMemo(() => items, []);
const {getTableProps, getTableBodyProps,headerGroups,page, prepareRow, setGlobalFilter, state, gotoPage, nextPage, previousPage, pageCount, canPreviousPage, canNextPage} = useTable({ columns, data:items,initialState : { pageSize: 4 } }, useGlobalFilter, useSortBy, usePagination);
const {globalFilter,pageIndex} = state;
const[itemData, setItemData] = useState({ name:"", description: "", price: "" });
const getItems = () => {
  axios.get("http://127.0.0.1:8000/api/items/")
    .then(rs => {
      setItems(rs.data);
    }) 
}
const handleChange = (e) => {
  setItemData({
    ...itemData,
    [e.target.name]: e.target.value
  });
  console.log("itemData : ",itemData);
}
const handleAddEdit = async(e) => {
  e.preventDefault();
  if(itemData.item_id){
    // Update existing item
    await axios.put(`http://127.0.0.1:8000/api/items/${itemData.item_id}/update/`,itemData)
    .then(rs => {
      console.log(rs.data);
    })
  }
  else {
  await axios.post("http://127.0.0.1:8000/api/items/",itemData)
    .then(rs => {
      console.log(rs.data);
    })
  }
    clearAll();
}
const clearAll = () => {
  setItemData({ name:"", description: "", price: "" });
  getItems();
}

const handleEdit = (item) => {
  setItemData(item);
}

const handleDelete = async (item) => {
  const isConfirmed = window.confirm(`Are you sure you want to delete item with ID ${item.item_id}?`);
  if(isConfirmed){
  await axios.delete(`http://127.0.0.1:8000/api/items/${item.item_id}/delete/`)
    .then(rs => {
      console.log(rs.data);
    })
  }
  window.location.reload();
}

React.useEffect(() => {
  getItems();
}, []);
  return (
    <>
      <div className='item-main'>
        <h3>Python Full Stack</h3>
        <div className='addeditpn'>
          <div className='addeditpndiv'>
            <label htmlFor='name'>Name</label><br />
            <input className='addeditinput' type="text" value={itemData.name} onChange={handleChange} name='name' id='name' placeholder='Enter Name' />
          </div>
          <div className='addeditpndiv'>
            <label htmlFor='desciption'>Desciption</label><br />
            <input className='addeditinput' type="text" value={itemData.description} onChange={handleChange} name='description' id='description' placeholder='Enter Description' />
          </div>
          <div className='addeditpndiv'>
            <label htmlFor='price'>Price</label><br />
            <input className='addeditinput' type="text" value={itemData.price} onChange={handleChange} name='price' id='price' placeholder='Enter Price' />
          </div>
          <button className='addBtn' onClick={handleAddEdit}>{itemData.item_id ? "Update" : "Add"}</button>
          <button className='cancelBtn'>Cancel</button>
        </div>
        <input className="searchinput" type="search" value={globalFilter || ""} onChange={e => setGlobalFilter(e.target.value)} name='inputser' id='inputser' placeholder="Search..." />
        <table className='item-table' {...getTableProps()}>
          <thead>
            {...headerGroups.map((hdg) => (
              <tr {...hdg.getHeaderGroupProps()} key={hdg.id}>
                {hdg.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>{column.render('Header')}
                  {column.isSorted && <span>{column.isSortedDesc ? ' 🔽' : ' 🔼'}</span>}
                  </th>
                  
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} key={cell.id}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className='pagediv'>
          <button className='pagedivbtn' disabled ={!canPreviousPage} onClick={() => gotoPage(0)}>First</button>
          <button className='pagedivbtn' disabled={!canPreviousPage} onClick={previousPage}>Prev</button>
          <span className='idx'>{pageIndex + 1} of {pageCount}</span>
          <button className='pagedivbtn' disabled={!canNextPage} onClick={nextPage}>Next</button>
          <button className='pagedivbtn' disabled={!canNextPage} onClick={() => gotoPage(pageCount - 1)}>Last</button>
        </div>
      </div>
    </>
  )
}

export default App

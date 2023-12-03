import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editUserId, setEditUserId] = useState(null);
  const [editColumn, setEditColumn] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = users?.filter((user) => {
      return Object.values(user).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const handleCheckboxChange = (userId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(userId)) {
        return prevSelectedRows.filter((id) => id !== userId);
      } else {
        return [...prevSelectedRows, userId];
      }
    });
  };

  

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter((user) => !selectedRows.includes(user.id));
    setUsers(updatedUsers);
    setSelectedRows([]);
  };

 

  const handleEdit = (userId, column) => {
    setEditUserId(userId);
    setEditColumn(column);
  };

  const handleSaveEdit = (userId, column, newValue) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, [column]: newValue };
      }
      return user;
    });

    setUsers(updatedUsers);
    // setEditUserId(null);
    // setEditColumn(null);
  };
 
  const renderTableRows = () => {
    
    const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
return filteredUsers.slice(startIndex, endIndex).map((user) => (
      <tr key={user.id} className={selectedRows.includes(user.id) ? 'selected-row' : ''}>
        <td>
          <input
            type="checkbox"
            checked={selectedRows.includes(user.id)}
            onChange={() => handleCheckboxChange(user.id)}
          />
        </td>
        {Object.entries(user).map(([key, value], index) => (
       
          <td key={index} onClick={() => handleEdit(user.id, key)}>
         
            {editUserId === user.id && editColumn === key ? (
              <input
                type="text"
                value={value}
                onChange={(e) => {
              
                  handleSaveEdit(user.id, key, e.target.value);
                }}
          

                />
            ) : (
              value
            )}
          </td>
        ))}
        <td>
          <button className="delete-btn" onClick={() => handleDelete(user.id)}>
            Delete
          </button>
          {/* {editUserId === user.id && (
            <button className="edit-btn" onClick={() => handleEdit(user.id, 'name')}>
              Save
            </button>
          )} */}
        </td>
      </tr>
    ));
  };




   const handleSelectAllRows = () => {
    // If all rows on the current page are already selected, deselect all; otherwise, select all
    if (selectedRows.length === filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).length) {
      setSelectedRows([]);
    } else {
      const pageUserIds = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(user => user.id);
      setSelectedRows(pageUserIds);
    }
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const pageButtons = [];

    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          className={i === currentPage ? 'active-page' : ''}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      )
    }
  
  return (
    <div className="pagination">
      <button onClick={() => setCurrentPage(1)}>First</button>
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {pageButtons}
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
      <button onClick={() => setCurrentPage(totalPages)}>Last</button>
    </div>
  );
  };


  const handleDelete = (userId) => {
    const updatedUsers = users?.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    setSelectedRows(selectedRows.filter((rowId) => rowId !== userId));
  };
  const itemsPerPage = 10;

  return (
    <div className="App">
      <div className="selection-header">
     
    </div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div></div>
     <input
        type="checkbox"
        onChange={handleSelectAllRows}
        checked={
          selectedRows.length === filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).length &&
          filteredUsers.length > 0
        }
      />
      <span>Select/Deselect All</span>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <React.Fragment>
          <table>
            <thead>
              <tr >
              {/* <span>Select/Deselect All</span> */}
                <th>Select </th>
                {users.length > 0 &&
                  Object.keys(users[0]).map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
          {renderPagination()}

          <div className="actions">
            <button className="delete-selected-btn" onClick={handleDeleteSelected}>
              Delete Selected
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../CSS/grid.css';
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState([]);
  const [user, setUser] = useState('Keshava');
  const [sortConfig, setSortConfig] = useState({ key: 'email', direction: 'ascending' });
  const [search, setSearch] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
        navigate("/");
    } else {

        setUser(userName);
    }
    const fetchEmployees = async () => {
        console.log('fetching data');
        try{
            const response = await axios.get('http://localhost:8000/employees',{
              headers: {  
                "authorization": localStorage.getItem("token"),
            },
            });
            setEmployees(response.data);
            console.log('data fetch SUCCESSFUL!!!');
            // setMessage(response.data.message);
            // alert(`Server Msg: ${message} , ${response.data.message}`);
        } catch(err) {
            let temp = err.response?.data || 'ReactJS Error In Getting employee';
            setMessage(temp);
            alert(`From Server: ${temp}`);
        }
    };

    fetchEmployees();
  }, [message, navigate,]);

  const handleSearch = (event) => { setSearch(event.target.value); };

  const handleSort = (key) => { 
    let direction = 'ascending';

    if (sortConfig.key === key && sortConfig.direction === 'ascending') { 
      direction = 'descending'; 
    } 
    setSortConfig({ key, direction }); 
  }; 
  const sortedFilteredEmployees = React.useMemo(() => { 
    let filteredEmployees = [...employees]; 
    // Apply search filter 
    if (search) { 
      filteredEmployees = filteredEmployees.filter(employee => 
        employee.name.toLowerCase().includes(search.toLowerCase()) || 
        employee.email.toLowerCase().includes(search.toLowerCase()) || 
        employee.mobile.toLowerCase().includes(search.toLowerCase()) 
      ); 
    } 
    
    // Apply sorting 
    filteredEmployees.sort((a, b) => { 
      // if (a[sortConfig.key] < b[sortConfig.key]) { 
      //   return sortConfig.direction === 'ascending' ? -1 : 1; 
      // } 
      // if (a[sortConfig.key] > b[sortConfig.key]) { 
      //   return sortConfig.direction === 'ascending' ? 1 : -1; 
      // } 
      if(  a[sortConfig.key].localeCompare(b[sortConfig.key]) > 0   ){
        console.log('1...');
        return sortConfig.direction === "ascending" ?  1 : -1 ;
      } 
      if(  a[sortConfig.key].localeCompare(b[sortConfig.key]) < 0   )  {
        console.log('-1..');
        return sortConfig.direction === "ascending" ?  -1 : 1 ;
      }
      return 0;
    }); 
    return filteredEmployees; 
  }, [employees, search, sortConfig]);

  const handleDelete = (id)=>{
    console.log('delete called:', id );
    const deleteEmp = async()=>{
      try{
        const res = await axios.delete('http://localhost:8000/employee/'+id);
        console.log(res.data);
        alert(`Message from server: ${res.data}`);
      } catch(err) {
        let temp = err.response?.data || 'ReactJS Error: Deleting employee';
        setMessage(temp);
        alert(`From Server: ${temp}`);
      }

    }
    deleteEmp();
    setMessage('');
    navigate('/employee-list');
  }

  return (
    <>
    <div className='row bg- mx-1'>
    <div class="container">
          <div className="col">Home</div>
          <div className="col"> <Link to="/employee-list">Employee List</Link> </div>
          <div className="col">{ user }</div>
          <div className="col"> <a href="/" > Logout </a>  </div>
          <div className="title"><div className=""> Employee List </div></div>
          <div className='count'>Total Count: {employees.length} </div>
          <div className='create-emp'><div > <Link to="/create-employee">Create Employee</Link></div></div>
          <div className='search'>
            <label htmlFor='searchbox'> Search: &nbsp; &nbsp; </label>
              <input type='text' id='searchbox' className="form-ontrol" placeholder="Search by name, email or mobile" value={search} onChange={handleSearch}/>
          </div>

          <div className='table'>
            <table className="table table-bordered table-striped custom-table">
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Profile Image</th>
                  <th onClick={() => handleSort('name')} >Name</th>
                  <th onClick={() => handleSort('email')}>Email</th>
                  <th onClick={() => handleSort('mobile')} >Mobile</th>
                  <th>Designation</th>
                  <th>Gender</th>
                  <th>Courses</th>
                  <th onClick={() => handleSort('createdDate')} >Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedFilteredEmployees.map((employee,index) => (
                  <tr key={employee._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img src={`http://localhost:8000/${employee.profileImage}`} alt="Profile" width="50" height="50" />
                    </td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.mobile}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.gender}</td>
                    <td>
                      { employee.coursesCompleted['BSC'] === true && 'BSC, ' }
                      { employee.coursesCompleted['BCA'] === true && 'BCA, ' }
                      { employee.coursesCompleted['MCA'] === true && 'MCA ' }
                    </td> 
                    <td>{new Date(employee.createdDate).toLocaleDateString()}
                      {/* {new Date(employee.createdDate).toLocaleTimeString()} */}
                    </td>
                    <td> <Link to={{ pathname: "/edit-employee/" }} state= {{ employeeId: employee._id}} title='Edit' >Edit</Link> - 
                          <div onClick={ ()=> handleDelete(employee._id)} className='text-danger link' title='Delete' >Delete</div> </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    </div>
    </div>
    </>
  )

  // return (
  //   <div className="card mx-1">
  //       <div className="card-header">
  //           <div className="row justify-content-evenly">
  //               <div className="col">Home</div>
  //               <div className="col"> <Link to="/employee-list">Employee List</Link> </div>
  //               <div className="col">{ user }</div>
  //               <div className="col"> <a href="/" > Logout </a>  </div>
  //           </div>
  //       </div>
  //       <div className="bg-warning-subtle"> Employee List </div>
  //       <div className='row justify-content-end'>
  //         <div className='col-3'>Total Count: {employees.length} </div>
  //         <div className='col-3'><Link to="/create-employee">Create Employee</Link></div>
  //       </div>

  //       <div className="card-body"></div>
  //     <table className="table table-striped">
  //       <thead>
  //         <tr>
  //           <th>Serial No.</th>
  //           <th>Profile Image</th>
  //           <th>Name</th>
  //           <th>Email</th>
  //           <th>Mobile</th>
  //           <th>Designation</th>
  //           <th>Gender</th>
  //           <th>Courses</th>
  //           <th>Created Date</th>
  //           <th>Action</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {employees.map((employee, index) => (
  //           <tr key={employee._id}>
  //             <td>{index + 1}</td>
  //             <td>
  //               <img src={`http://localhost:8000/${employee.profileImage}`} alt="Profile" width="50" height="50" />
  //             </td>
  //             <td>{employee.name}</td>
  //             <td>{employee.email}</td>
  //             <td>{employee.mobile}</td>
  //             <td>{employee.designation}</td>
  //             <td>{employee.gender}</td>
  //             <td>
  //               { employee.coursesCompleted['BSC'] === true && 'BSC, ' }
  //               { employee.coursesCompleted['BCA'] === true && 'BCA, ' }
  //               { employee.coursesCompleted['MCA'] === true && 'MCA ' }
  //             </td> 
  //             <td>{new Date(employee.createdDate).toLocaleDateString()}
  //               {/* {new Date(employee.createdDate).toLocaleTimeString()} */}
  //             </td>
  //             <td> <Link to="/edit-employee" employeeId={employee._id} >Edit</Link>  -   <Link to="/delete-employee">Delete</Link> </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );
};

export default EmployeeList;

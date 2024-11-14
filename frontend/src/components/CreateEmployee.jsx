import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEmployeeForm = (props) => {

    const navigate = useNavigate();
    const [emailMsg, setEmailMsg] = useState('') ;
    var [nameMsg, setNameMsg] = useState('') ;
    var [mobileMsg, setMobileMsg] = useState('') ;
    let mesg = '';

    useEffect(() => {
        
        const token = localStorage.getItem("token");
        console.log('token in local storage:', token);
        if (!token || token === "null" || token === "undefined") {
            navigate("/");
        } else {
            setUser(localStorage.getItem('username'));

        }
    }, [navigate]);
    
    const [user, setUser] = useState('Keshava');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [gender, setGender] = useState('');
    const [designation, setDesignation] = useState('');
    const [checkedItems, setCheckedItems] = useState({
        MCA: false,
        BCA: false,
        BSC: false,
    });
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('raama');


    const handleCourseChange = (e) => {
        const { name, checked } = e.target;
        
        setCheckedItems((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
        console.log(checkedItems);
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // setPreview(URL.createObjectURL(file));  
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        mesg = 'Required';

        const submitData = new FormData();
        submitData.append("username", username);
        submitData.append("email", email);
        if (mobile.length === 10) submitData.append("mobile", mobile);
        else {  // required mobile
            mesg += ' Mobile Number,';
        }
        if (gender) submitData.append("gender", gender);
        else {
            mesg += ' Gender,'
        }
        if (designation) submitData.append("designation", designation);
        else {
            mesg += ' Designation,'
        }
        if ( checkedItems && (checkedItems.BCA === true ||
            checkedItems.BSC === true ||
            checkedItems.MCA === true)
        ) submitData.append("checkedItems", JSON.stringify(checkedItems));
        else {
            mesg += ' Course,'
        }
        if (image) {
            submitData.append("profileImage", image);
        }
        else {
            mesg += ' Image,'
        }

        if(mesg !== 'Required') {
            alert(mesg);
            e.preventDefault();
            return;
        }
        try {
            // console.log('create emp: in try block');                 
            const res = await axios.post('http://localhost:8000/create-employee',
                submitData,
                {
                    headers: { "Content-Type": "multipart/form-data", 
                        "authorization": localStorage.getItem("token"),
                        // "enctype": "multipart/form-data"
                    },
                }
            );
            console.log('create emp: in try block');                 
            setMessage(res.data.message);
            navigate('/employee-list')
            // localStorage.setItem('token', res.data.token); // Store JWT for future requests
        } catch (err) {
            let temp = err.response?.data || 'React Error: Creating employee';
            setMessage(temp);
            alert(`From Server: ${temp}`);
        }
    };

    return <>
    <div className="card justify-content-start m-2">
        <div className="card-header">
            <div className="row justify-content-evenly">
                <div className="col">Home</div>
                <div className="col">Employee List</div>
                <div className="col">{ user }</div>
                <div className="col"> <a href="/" > Logout </a>  </div>
            </div>
        </div>
        <div className="card-body  p-0 justify-content-start">
            <div className="bg-warning-subtle"> <h3> Create Employee </h3>  </div>
            <div className="p-2">
              <form onSubmit={handleSubmit} enctype="multipart/form-data" > 
                <div className="d-flex" >
                    <label htmlFor="username" className=' col-3 form-control-lg'> User Name</label>
                   
                    <input type='text' id='username' placeholder="User Name"
                        value={username}
                        onChange={(e) => {
                            const name = e.target.value;
                            const namePattern = /^[a-zA-Z\s-\\.]+$/; // Allows letters, spaces, and hyphens 
                            if (!namePattern.test(name)) {
                                setNameMsg('Please enter a valid name.');
                                // alert('Please enter a valid name. Only letters, spaces, and hyphens are allowed.');
                                e.preventDefault();
                            } else setNameMsg('');
                            setUsername(e.target.value)
                        }}
                        required />
                        <div className="p-2"> {nameMsg} </div>
                        
                </div> <br/>
                <div className='d-flex'>
                    <label htmlFor="email" className=' col-3 form-control-lg'> Email</label>
                    <input type='email' id='email' placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            const email = e.target.value;
                            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern 
                            if (!emailPattern.test(email)) {
                                setEmailMsg('Please enter a valid email address.');
                                // alert('Please enter a valid email address.');
                                e.preventDefault(); 
                            } else setEmailMsg('');
                            setEmail(e.target.value)
                        }}
                        required />
                        <div className="p-2"> {emailMsg} </div>
                </div> <br/>
                <div className="d-flex">
                    <label htmlFor="mobile" className='col-3 form-control-lg'>Mobile</label>
                    <input type='text' id='mobile' placeholder="mobile"
                        value={mobile}
                        onChange={(e) => {
                            const mobileNumber = (e.target.value);
                             const mobilePattern = /^[6-9]\d{0,9}$/;
                             if (!mobilePattern.test(mobileNumber)) {
                                setMobileMsg('Please enter a valid mobile number (starting with 6-9 and 10 digits long).');
                                // alert('Please enter a valid mobile number (starting with 6-9 and 10 digits long).');  
                            }  else {
                                setMobileMsg('');
                            }
                            setMobile(mobileNumber);
                        }}
                        onBlur={(e)=>{
                            const mobileNumber = (e.target.value);
                             const mobilePattern = /^[6-9]\d{9}$/;
                             if (!mobilePattern.test(mobileNumber)) {
                                setMobileMsg('Please enter a valid mobile number (starting with 6-9 and 10 digits long).');
                                // alert('Please enter a valid mobile number (starting with 6-9 and 10 digits long).');  
                            }  else {
                                setMobileMsg('');
                            }
                        }}
                         />
                        <div className="p-2"> {mobileMsg} {mobile && <span>{mobile}</span>} </div>
                </div>
                <br/>
                <div className="d-flex">
                <div  className='col-3 form-control-lg  justify-content-start bg-'>Gender</div>
                    <div className="form-check">
                    <label >
                    <input className="form-check-input"
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={gender === "Male"}
                        onChange={(e) => {setGender(e.target.value); }}
                    />
                        Male
                    </label>
                    <br />
                    <label className="cursor-pointer">
                        <input className="form-check-input"
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={gender === "Female"}
                            onChange={(e) => {setGender(e.target.value); }}
                        />
                        Female
                    </label>
                    </div>
                    </div>
                <br/>
                <div className="d-flex"> 
                    <label className='col-3 form-control-lg bg-' htmlFor="role">Designation:</label>
                    <select id="role" value={designation} onChange={(e)=>{setDesignation(e.target.value)}}>
                        <option value="" disabled>
                            -- Select Role --
                        </option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                </div><br />
                <div className="d-flex">
                    <div  className='col-3 form-control-lg bg-'>Course</div>

                    <div className="justify-content" >
                        <input type="checkbox" className="" id="MCA" name="MCA" checked={checkedItems.MCA}
                            onChange={handleCourseChange} />
                        <label htmlFor="MCA" className="" > MCA </label><br/>
                        <input type="checkbox" id="BCA" name="BCA" checked={checkedItems.BCA}
                            onChange={handleCourseChange} />
                        <label htmlFor="BCA" className=""> BCA </label><br/>
                        <input type="checkbox" id="BSC" name="BSC" checked={checkedItems.BSC}
                            onChange={handleCourseChange}/>
                        <label htmlFor="BSC"> BSC </label><br/>
                    </div>
                </div> <br/>
                <div className='d-flex'>
                    <label className='col-3 form-control-lg' htmlFor="imageInput"> Image Upload:</label>
                    <input name="profileImage"
                        type="file"
                        id="imageInput"
                        accept=".png, .jpg, "
                        onChange={handleImageChange}
                    />
                    <br />
                </div>
                <div className="d-flex justify-content-center">
                <button className="btn btn-success me-4" type="submit">Submit</button>
                <div> {message && <p> &nbsp;&nbsp;&nbsp; {  message}</p>} </div>
                </div>
              </form>
            </div>
        </div>
        <div>
            
        </div>
    </div>
    </>
}

export {
    CreateEmployeeForm
}

// .jpeg
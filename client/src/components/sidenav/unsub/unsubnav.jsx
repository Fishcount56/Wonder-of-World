import React, {useContext, useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import iconsm from '../../../assets/iconsm.png'
import eclipse from '../../../assets/eclipse.png'
import user1 from '../../../assets/user1.png'
import bill1 from '../../../assets/bill1.png'
import logout1 from '../../../assets/logout1.png'
import cssModule from'./unsubnav.module.css'
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
import userPhoto from "../../../assets/user.png"
import { API } from "../../../config/api";

const UnSubNav = () => {
    const [state, dispatch] = useContext(UserContext);
    const navigate = useNavigate()
    const [profile, setProfile] = useState({})
    let id = state.user.id
    

    const backtohome = () => {
        navigate('/dashboard')
    }

    const logout = () => {
        dispatch({
          type: "LOGOUT",
        });
        navigate("/");
    };

    // const getProfile = async (id) => {
    //     try {
    //         const response = await API.get('/profile')
    //         setProfile(response.data.data.Profile)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    useEffect(() => {
        let isUnmount = false
        const getProfile = async (id) => {
            try {
                const response = await API.get('/profile')
                if(!isUnmount) {
                    setProfile(response.data.data.Profile)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getProfile(id)
        return () => {
            isUnmount = true
        }
    }, [])
    return(
        <nav>
            <div className="unsub-content-parent">
                <div className={cssModule.contentchild}>
                    <div className={cssModule.navicon}>
                        <img onClick={() => backtohome()} src={iconsm} />
                    </div>
                    {profile && (
                        <div className={cssModule.displayprofile}>
                            <img src={profile.userPhoto ? profile.userPhoto : userPhoto} alt='userPhoto'/>
                            <p className={cssModule.username}>{state.user.name}</p>
                            <p className={cssModule.usernot}>Not Subscribe Yet</p>
                        </div>
                    )}
                        <hr />
                        <ul>
                            <li>
                                <img src={user1} /><Link to="/profile">Profile</Link>
                            </li>
                            <li>
                                <img src={bill1} /><Link to="/subspage">Subscribe</Link>
                            </li>
                        </ul>
                        <hr />
                        <ul>
                            <li>
                                <img src={logout1} /><Link to="/" onClick={logout}>Logout</Link>
                            </li>
                        </ul>
                </div>
            </div>
        </nav>
    )
}

export default UnSubNav
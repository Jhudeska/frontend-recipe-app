import './Profile.css'
import userBadge from "../../assets/user-regular-full.svg" ;


function Profile() {
    return (
        <>
        <section className="outer-container page-container">
            <div className="inner-container profile">
                <h1 className="align-left">Profile</h1>

            </div>
        </section>

        <section className="outer-container page-container">
            <div className="inner-container">
                <span className="circle"> <img src={userBadge} className="circle_img" /> </span>
                <p className="test">change profile picture</p>
                <input />
                <input/>
                <button className="profile-btn" type="submit">Cancel</button>
                <button className="profile-btn" type="submit">Save</button>
            </div>
        </section>

            </>
    )
}

export default Profile
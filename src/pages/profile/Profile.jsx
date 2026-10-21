import './Profile.css'
import userBadge from "../../assets/user-regular-full.svg" ;
import Button from "../../components/button/Button.jsx";
import InputField from "../../components/inputfield/InputField.jsx";


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

                <span className="circle"><img src={userBadge} className="circle_img" /> </span>
                <p className="test">change profile picture</p>
                <div className="profile-container">
                    <InputField type="text" placeholder="Username" inputColor="field" />
                    <InputField type="password" placeholder="Password" inputColor="field" />
                    <InputField type="password" placeholder="Password_reset" inputColor="field" />
                </div>
                <div className="btn-container">
                    <Button  label=" " buttonType="submit"  btnColor="green-filled" text="Cancel" />
                    <Button  label=" " buttonType="submit"  btnColor="green-filled" text="Save" />
                </div>
            </div>
        </section>

            </>
    )
}

export default Profile
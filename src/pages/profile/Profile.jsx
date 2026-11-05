import './Profile.css'
import {useState, useEffect} from "react";
import userBadge from "../../assets/user-regular-full.svg" ;
import Button from "../../components/button/Button.jsx";
import InputField from "../../components/inputfield/InputField.jsx";
import { useAppContext } from "../../context/AppStatusContext.jsx";
import { getMyUserProfile, updateMyUserProfile } from "../../api/userProfileService.js"
import {useAuth} from "../../context/AuthContext.jsx";
import TextArea from "../../components/textarea/TextArea.jsx"
import MessageLabel from "../../components/messagelabel/MessageLabel.jsx";
import {useNavigate} from "react-router-dom";



function Profile() {

    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { loading, setLoading, error, setError, clearError } = useAppContext();

    const [profile, setProfile] = useState(null);

    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        profilePhotoUrl: "",
        bio: "",
    });

    useEffect(() => {

        if (authLoading) return;

        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        let active = true;

        const fetchProfile = async () => {

            setLoading(true);
            clearError();

            try {

                const response = await getMyUserProfile();

                if (!active) return;

                const data = response.data;

                setProfile(data);

                setFormData({
                    username: data.username || "",
                    email: data.email || "",
                    profilePhotoUrl: data.profilePhotoUrl || "",
                    bio: data.bio || ""
                });

            } catch (err) {

                console.error("Profile ophalen mislukt:", err);

                if (active) {
                    setError(
                        err.response?.data?.message ||
                        "Profile could not be loaded."
                    );
                }

            } finally {

                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            active = false;
        };

    }, [authLoading, isAuthenticated]);


    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        clearError();
        setSuccess("");
    };


    const handleCancel = () => {

        if (!profile) return;

        setFormData({
            username: profile.username || "",
            email: profile.email || "",
            profilePhotoUrl: profile.profilePhotoUrl || "",
            bio: profile.bio || ""
        });

        clearError();
        setSuccess("");

        navigate("/");
    };

    const handleSave = async (event) => {
        event.preventDefault();

        setLoading(true);
        clearError();
        setSuccess("");

        try {
            const updateData = {
                username: formData.username,
                email: formData.email,
                profilePhotoUrl: formData.profilePhotoUrl,
                bio: formData.bio
            };

            console.log("Profielgegevens versturen:", updateData);

            // PUT naar Spring Boot backend
            const response = await updateMyUserProfile( updateData);

            // Backend geeft bijgewerkt profiel terug
            const updatedProfile = response.data;

            setProfile(updatedProfile);

            setFormData({
                username: updatedProfile.username || "",
                email: updatedProfile.email || "",
                profilePhotoUrl: updatedProfile.profilePhotoUrl || "",
                bio: updatedProfile.bio || ""
            });

            setSuccess("Profile successfully updated!");

            navigate("/");

        } catch (err) {
            console.error(
                "Profile updaten mislukt:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                "Profile could not be updated."
            );

        } finally {
            setLoading(false);
        }
    };


    if (authLoading || loading && !profile) {
        return <p>Loading profile...</p>;
    }

    if (!isAuthenticated) {
        return <p>Please log in to view your profile.</p>;
    }

    if (error && !profile) {
        return <p>{error}</p>;
    }

    return (
        <>

            <section className="outer-container page-container">
                <div className="inner-container profile">
                    <h1 className="align-left">Profile</h1>
                </div>
            </section>

            <section className="outer-container page-container">
                <div className="inner-container">

        <span className="circle">
            <img
                src={formData.profilePhotoUrl || userBadge}
                className="circle_img"
                alt="Profile"
            />
        </span>
                    {error && (
                        <p className="error-message">
                           <MessageLabel>{error}</MessageLabel>
                        </p>
                    )}

                    {success && (
                        <p className="success-message">
                            <MessageLabel>{success}</MessageLabel>

                        </p>
                    )}

                    <p className="test">Change profile picture</p>

                    <section className="profile-container">

                        <InputField
                            label="Username *"
                            type="text"
                            placeholder="Username"
                            inputColor="field"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            reqiured
                        />

                        <InputField
                            label="Email *"
                            type="email"
                            placeholder="Email"
                            inputColor="field"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <InputField
                            label="Image (Optional)"
                            type="url"
                            placeholder="Profile photo URL"
                            inputColor="field"
                            name="profilePhotoUrl"
                            value={formData.profilePhotoUrl}
                            onChange={handleChange}
                        />

                        <TextArea
                            label="Bio (Optional)"
                            className="field"
                            placeholder="Bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                        />

                    </section>

                    <section className="btn-container">

                        <Button
                            text="Cancel"
                            buttonType="button"
                            btnColor="green-outline"
                            onClick={handleCancel}
                        />

                        <Button
                            text="Save"
                            buttonType="submit"
                            btnColor="green-filled"
                            onClick={handleSave}
                        />

                    </section>

                </div>
            </section>


        </>
    )
}

export default Profile

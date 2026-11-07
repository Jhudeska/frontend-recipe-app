import './Admin.css'
import AdminCategory from "./AdminCategory.jsx";
import AdminRecipeIngredient from "./AdminRecipeIngredient.jsx";
import AdminRecipe from "./AdminRecipe.jsx";
import AdminIngredient from "./AdminIngredient.jsx";
import AdminReviewRating from "./AdminReviewRating.jsx";
import AdminUserProfile from "./AdminUserProfile.jsx";
import AdminUserProfileRole from "./AdminUserProfileRole.jsx";




function Admin() {

    return (
    <section className="outer-container page-container">
        <div className="inner-container">
            <h1>Admin Panel</h1>
            <div className="divider"> </div>

            {/* Niet niet moeiste oplossing maar kan later een dashboard controller van maken */}

            <AdminUserProfile />

            <AdminUserProfileRole />

            <AdminReviewRating />

            <AdminRecipe />

            <AdminCategory />

            <AdminIngredient />

            <AdminRecipeIngredient />


        </div>
    </section>
    )
}

export default Admin
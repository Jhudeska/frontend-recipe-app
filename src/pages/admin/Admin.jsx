import './Admin.css'
import soup from "../../assets/kippensoep.png";
import AdminCategory from "./AdminCategory.jsx";
import AdminRecipeIngredient from "./AdminRecipeIngredient.jsx";
import AdminRecipe from "./AdminRecipe.jsx";

import {
    getAllRecipeImages,
    createRecipeImage,
    uploadRecipeImage,
    updateRecipeImage,
} from "../../api/recipeImageService.js";
import {useEffect} from "react";
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

            {/*<h1>Users</h1>*/}
            {/*<table className="data1">*/}
            {/*    <thead>*/}
            {/*    <tr className="thead">*/}
            {/*        <th></th>*/}
            {/*        <th>Title</th>*/}
            {/*        <th>Description</th>*/}
            {/*        <th>Add</th>*/}
            {/*        <th>Edit</th>*/}
            {/*        <th>Delete</th>*/}
            {/*    </tr>*/}
            {/*    </thead>*/}

            {/*    <tbody>*/}
            {/*    <tr>*/}
            {/*        <td>*/}
            {/*            <img className="recipes_img" src={soup} alt="Kippensoep" />*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <strong>Kippensoep</strong>*/}
            {/*        </td>*/}
            {/*        <td>Lorem50</td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*    </tr>*/}

            {/*    <tr>*/}
            {/*        <td>*/}
            {/*            <img className="recipes_img" src={soup} alt="Kippensoep" />*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <strong>Kippensoep</strong>*/}
            {/*        </td>*/}
            {/*        <td>Lorem50</td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*    </tr>*/}
            {/*    </tbody>*/}
            {/*</table>*/}
            <AdminUserProfile />

            <AdminUserProfileRole />

            <AdminReviewRating />
            {/*<h1>Review Rating</h1>*/}
            {/*<table className="data1">*/}
            {/*    <thead>*/}
            {/*    <tr className="thead">*/}
            {/*        <th></th>*/}
            {/*        <th>Title</th>*/}
            {/*        <th>Description</th>*/}
            {/*        <th>Add</th>*/}
            {/*        <th>Edit</th>*/}
            {/*        <th>Delete</th>*/}
            {/*    </tr>*/}
            {/*    </thead>*/}

            {/*    <tbody>*/}
            {/*    <tr>*/}
            {/*        <td>*/}
            {/*            <img className="recipes_img" src={soup} alt="Kippensoep" />*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <strong>Kippensoep</strong>*/}
            {/*        </td>*/}
            {/*        <td>Lorem50</td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*    </tr>*/}

            {/*    <tr>*/}
            {/*        <td>*/}
            {/*            <img className="recipes_img" src={soup} alt="Kippensoep" />*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <strong>Kippensoep</strong>*/}
            {/*        </td>*/}
            {/*        <td>Lorem50</td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*    </tr>*/}
            {/*    </tbody>*/}
            {/*</table>*/}



            {/*<h1>Recipes</h1>*/}
            {/*<table className="data1">*/}
            {/*    <thead>*/}
            {/*    <tr className="thead">*/}
            {/*        <th></th>*/}
            {/*        <th>Title</th>*/}
            {/*        <th>Description</th>*/}
            {/*        <th>Add</th>*/}
            {/*        <th>Edit</th>*/}
            {/*        <th>Delete</th>*/}
            {/*    </tr>*/}
            {/*    </thead>*/}

            {/*    <tbody>*/}
            {/*    <tr>*/}
            {/*        <td>*/}
            {/*            <img className="recipes_img" src={soup} alt="Kippensoep" />*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <strong>Kippensoep</strong>*/}
            {/*        </td>*/}
            {/*        <td>Lorem50</td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*    </tr>*/}

            {/*    <tr>*/}
            {/*        <td>*/}
            {/*            <img className="recipes_img" src={soup} alt="Kippensoep" />*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <strong>Kippensoep</strong>*/}
            {/*        </td>*/}
            {/*        <td>Lorem50</td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*    </tr>*/}
            {/*    </tbody>*/}
            {/*</table>*/}
            <AdminRecipe />




            {/*<h1>Categories</h1>*/}
            {/*<table className="data1">*/}
            {/*    <thead>*/}
            {/*    <tr className="thead">*/}
            {/*        <th></th>*/}
            {/*        <th>Title</th>*/}
            {/*        <th>Description</th>*/}
            {/*        <th>Add</th>*/}
            {/*        <th>Edit</th>*/}
            {/*        <th>Delete</th>*/}
            {/*    </tr>*/}
            {/*    </thead>*/}

            {/*    <tbody>*/}
            {/*    <tr>*/}
            {/*        <td>*/}
            {/*            <img className="recipes_img" src={soup} alt="Kippensoep" />*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <strong>Kippensoep</strong>*/}
            {/*        </td>*/}
            {/*        <td>Lorem50</td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*    </tr>*/}

            {/*    <tr>*/}
            {/*        <td>*/}
            {/*            <img className="recipes_img" src={soup} alt="Kippensoep" />*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <strong>Kippensoep</strong>*/}
            {/*        </td>*/}
            {/*        <td>Lorem50</td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*    </tr>*/}
            {/*    </tbody>*/}
            {/*</table>*/}
            <AdminCategory />




            <AdminIngredient />
            {/*<h1>Ingredients</h1>*/}
            {/*<table className="data1">*/}
            {/*    <thead>*/}
            {/*    <tr className="thead">*/}
            {/*        <th></th>*/}
            {/*        <th>Title</th>*/}
            {/*        <th>Description</th>*/}
            {/*        <th>Add</th>*/}
            {/*        <th>Edit</th>*/}
            {/*        <th>Delete</th>*/}
            {/*    </tr>*/}
            {/*    </thead>*/}

            {/*    <tbody>*/}
            {/*    <tr>*/}
            {/*        <td>*/}
            {/*            <img className="recipes_img" src={soup} alt="Kippensoep" />*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <strong>Kippensoep</strong>*/}
            {/*        </td>*/}
            {/*        <td>Lorem50</td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*    </tr>*/}

            {/*    <tr>*/}
            {/*        <td>*/}
            {/*            <img className="recipes_img" src={soup} alt="Kippensoep" />*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <strong>Kippensoep</strong>*/}
            {/*        </td>*/}
            {/*        <td>Lorem50</td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*        <td>*/}
            {/*            <button className="mini-btn x">x</button>*/}
            {/*        </td>*/}
            {/*    </tr>*/}
            {/*    </tbody>*/}
            {/*</table>*/}
            <AdminRecipeIngredient />


        </div>
    </section>
    )
}

export default Admin
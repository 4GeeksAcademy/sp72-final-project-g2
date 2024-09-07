import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/profile.css";
import Button from 'react-bootstrap/Button';

export const Profile = () => {
    const { store, actions } = useContext(Context);  // Desestructuramos las actions y store
    const [formData, setFormData] = useState({
        weight: store.currentUser ? store.currentUser.weight || '' : '',
        height: store.currentUser ? store.currentUser.height || '' : '',
        age: store.currentUser ? store.currentUser.age || '' : '',
        sex: store.currentUser ? store.currentUser.sex || 'male' : 'male', // Por defecto 'male'
        bmr: null,
        calories: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const calculateBMR = () => {
        const { sex, age, height, weight } = formData;
        if (!age || !height || !weight) {
            alert("Por favor, ingresa todos los datos necesarios.");
            return;
        }

        let calculatedBMR;
        const heightInCm = parseFloat(height);
        const weightInKg = parseFloat(weight);
        const ageValue = parseInt(age);

        if (sex === 'male') {
            calculatedBMR = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * ageValue);
        } else {
            calculatedBMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * ageValue);
        }

        const calorieNeeds = {
            BMR: calculatedBMR.toFixed(2),
            Sedentary: (calculatedBMR * 1.2).toFixed(0),
            "Lightly active": (calculatedBMR * 1.375).toFixed(0),
            "Moderately active": (calculatedBMR * 1.55).toFixed(0),
            "Highly active": (calculatedBMR * 1.725).toFixed(0),
            "Super athletic": (calculatedBMR * 1.9).toFixed(0)
        };

        setFormData({ ...formData, bmr: calorieNeeds.BMR, calories: calorieNeeds });
    };

    useEffect(() => {
        const sidebarToggle = document.getElementById('sidebarCollapse');
        const sidebar = document.getElementById('sidebar');

        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        return () => {
            sidebarToggle.removeEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        };
    }, []);

    return (
        !store.currentUser ?
            <h1>Cargando...</h1>
            :
            <div className="wrapper bg-white" style={{ marginTop: '55px' }}>
                <nav id="sidebar" className="pt-5">
                    <ul className="list-unstyled components">
                        <li><a href="#"><i className="fa-solid fa-chart-line"></i> Dashboard</a></li>
                        <li><a href="#"><i className="fa-regular fa-user"></i> Datos Corporales</a></li>
                        <li><a href="#"><i className="fa-solid fa-clock-rotate-left"></i> Historial</a></li>
                    </ul>
                </nav>
                <div id="content" className="m-auto">
                    <nav className="navbar navbar-expand-lg navbar-dark">
                        <div className="container-fluid">
                            <button type="button" id="sidebarCollapse" className="btn btn-light py-2">
                                <i className="fa-solid fa-align-left px-2"></i>
                                <span> Menu</span>
                            </button>
                        </div>
                    </nav>
                    <h1 className="h1-profile text-center">{store.currentUser.firstname} {store.currentUser.lastname}</h1>
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 d-flex align-items-center justify-content-center">
                            <div className="cards-dashboard d-flex flex-column justify-content-center align-items-center" style={{ width: '100%', height: '96%' }}>
                                <i className="fa-solid fa-user fa-8x py-2"></i>
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Peso (kg):</label>
                                        <input
                                            type="number"
                                            name="weight"
                                            className="form-control"
                                            value={formData.weight}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Altura (cm):</label>
                                        <input
                                            type="number"
                                            name="height"
                                            className="form-control"
                                            value={formData.height}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Edad:</label>
                                        <input
                                            type="number"
                                            name="age"
                                            className="form-control"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Sexo:</label>
                                        <select
                                            name="sex"
                                            className="form-control"
                                            value={formData.sex}
                                            onChange={handleInputChange}
                                        >
                                            <option value="male">Hombre</option>
                                            <option value="female">Mujer</option>
                                        </select>
                                    </div>
                                </form>
                                <Button className="btn-profile" variant="primary" onClick={calculateBMR}>
                                    Calcular IMC
                                </Button>
                            </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                            <div className="row">
                                <div className="col-12">
                                    <div className="cards-dashboard">
                                        <p className="p-profile">DIETA OBJETIVO</p>
                                        {formData.bmr && (
                                            <div>
                                                <p className="p-profile">BMR: {formData.bmr} kcal/día</p>
                                                <p className="p-profile">Calorías necesarias (Sedentario): {formData.calories.Sedentary} kcal</p>
                                                <p className="p-profile">Calorías necesarias (Ligeramente activo): {formData.calories["Lightly active"]} kcal</p>
                                                <p className="p-profile">Calorías necesarias (Moderadamente activo): {formData.calories["Moderately active"]} kcal</p>
                                                <p className="p-profile">Calorías necesarias (Muy activo): {formData.calories["Highly active"]} kcal</p>
                                                <p className="p-profile">Calorías necesarias (Super atlético): {formData.calories["Super athletic"]} kcal</p>
                                            </div>
                                        )}
                                        <h3 className="h3-profile">2205<p className="p-profile py-0"> KCAL</p></h3>
                                        <i className="fa-solid fa-flag-checkered fa-3x d-flex justify-content-center"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <div className="cards-dashboard">
                                        <p className="p-profile">PROTEINAS RESTANTES</p>
                                        <h3 className="h3-profile">2205<p className="p-profile py-0"> GR</p></h3>
                                        <i className="fa-solid fa-drumstick-bite fa-3x d-flex justify-content-center"></i>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <div className="cards-dashboard-dark">
                                        <p className="p-profile">KCAL INGERIDAS</p>
                                        <h3 className="h3-profile">0<p className="p-profile py-0"> KCAL</p></h3>
                                        <i className="fa-solid fa-utensils fa-3x d-flex justify-content-center"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                <div className="cards-dashboard-dark">
                                    <p className="p-profile">PLANES NUTRICIONALES</p>
                                    <h3 className="h3-profile">0</h3>
                                    <i className="fa-solid fa-calendar-days fa-3x d-flex justify-content-center"></i>
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                <div className="cards-dashboard">
                                    <p className="p-profile">RUTINAS DE EJERCICIOS</p>
                                    <h3 className="h3-profile">0</h3>
                                    <i className="fa-solid fa-dumbbell fa-3x d-flex justify-content-center"></i>
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                <div className="cards-dashboard-dark">
                                    <p className="p-profile">CARBOHIDRATOS RESTANTES</p>
                                    <h3 className="h3-profile">205<p className="p-profile py-0"> GR</p></h3>
                                    <i className="fa-solid fa-bread-slice fa-3x d-flex justify-content-center"></i>
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3">
                                <div className="cards-dashboard">
                                    <p className="p-profile">GRASAS RESTANTES</p>
                                    <h3 className="h3-profile">85<p className="p-profile py-0"> GR</p></h3>
                                    <i className="fa-solid fa-droplet fa-3x d-flex justify-content-center"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}


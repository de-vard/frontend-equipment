import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";

function Login() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <div className="content text-center px-4">
            <h1 className="text-primary">TechControl System</h1>
            <p className="content">
              Войдите в систему для управления учётными записями и оборудованием. <br />
              Если у вы забыли пароль востановить его можно по ссылки, <Link to="/register/">востановить_пароль</Link>.
            </p>
          </div>
        </div>
        <div className="col-md-6 p-5">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
import React from 'react';
import { useDispatch } from 'react-redux';
import './Login.scss'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom'
import {fetchAuth} from '../../redux/slices/auth'

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Неправильный email').required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Минимум 6 символов')
    .max(50, 'Максимум 50 символов')
    .required('Обязательное поле'),

});


function Login() {

  const dispatch = useDispatch()

  return (
    <div className='login'>
      <div className='login__wrapper'>
        <h3 className='login__title'>Войти в аккаунт</h3>
        <div className='login__card'>
          <Formik
            initialValues={{
              email: 'eemail@mail.ru',
              password: 'password',            
            }}
            validationSchema={SignupSchema}
            onSubmit={async (values) => {
              alert('gg')

              let res = await dispatch(fetchAuth(values))
              console.log(res)
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className='input'>
                  <div className='input__title'>Email</div>
                  <Field name="email" />
                  {errors.email && touched.email ? <div className='error'>{errors.email}</div> : null}
                </div>

                <div className='input'>
                  <div className='input__title'>Пароль</div>
                  <Field name="password" />
                  {errors.password && touched.password ? (
                    <div className='error'>{errors.password}</div>
                  ) : null}
                </div>
                <div className='login__button'>
                  <button className='' type="submit">Войти</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className='login__bottom'>
          <Link to = '/registration'>Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  )
}


export default Login;
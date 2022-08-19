import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './Registration.scss'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, Navigate } from 'react-router-dom'
import { fetchRegistration, UserId } from '../../redux/slices/auth'

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Минимум 2 символа')
    .max(50, 'Максимум 50 символов')
    .required('Обязательное поле'),
  email: Yup.string().email('Неправильный email').required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Минимум 6 символов')
    .max(50, 'Максимум 50 символов')
    .required('Обязательное поле'),
});


export const Registration = () => {
  const dispatch = useDispatch()
  const userId = useSelector(UserId);
  if (userId) return <Navigate to="/"/>
  
  

  return (
    <div className='registration'>
      <div className='registration__wrapper'>
        <h3 className='registration__title'>Регистрация</h3>
        <div className='registration__card'>
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={async (values) => {
              const res = await dispatch(fetchRegistration(values))
              res.payload ? localStorage.setItem('userId', res.payload.userId) : alert('Не удалось зарегестрироваться')
            }}
          >
            {({ errors, touched }) => (
              <Form>

                <div className='input'>
                  <div className='input__title'>Как вас зовут</div>
                  <Field name="name" />
                  {errors.name && touched.name ? <div className='error'>{errors.name}</div> : null}
                </div>


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
                <div className='registration__button'>
                  <button className='' type="submit">Зарегистрироваться</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className='registration__bottom'>
          <Link to='/login'>Войти в аккаунт</Link>
        </div>
      </div>
    </div>
  )
}

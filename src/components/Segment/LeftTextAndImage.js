import React from 'react'
import { Link } from '@reach/router'
import Reveal from 'react-awesome-reveal'
import { keyframes } from '@emotion/react'

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const IntroImage = ({ context }) => {
  return (
    <div className='container'>
      <div className='row align-items-center'>
        <div className='col-md-6'>
          <div className='spacer-single' />
          <Reveal
            className='onStep'
            keyframes={fadeInUp}
            delay={0}
            duration={600}
            triggerOnce
          />
          <div className='spacer-10' />
          <Reveal
            className='onStep'
            keyframes={fadeInUp}
            delay={300}
            duration={600}
            triggerOnce
          >
            <h1 className=''>{context.title}</h1>
          </Reveal>
          <Reveal
            className='onStep'
            keyframes={fadeInUp}
            delay={600}
            duration={600}
            triggerOnce
          >
            <p className=' lead'>{context.subtitle}</p>
          </Reveal>
          <div className='spacer-10' />
          <Reveal
            className='onStep'
            keyframes={fadeInUp}
            delay={800}
            duration={900}
            triggerOnce
          >
            <Link to={context.buttonAction} className='btn-main lead'>
              {context.button}
            </Link>
            <div className='mb-sm-30' />
          </Reveal>
        </div>
        <div className='col-md-6 xs-hide'>
          <Reveal
            className='onStep'
            keyframes={fadeIn}
            delay={900}
            duration={1500}
            triggerOnce
          >
            <img src={context.imageUrl} className='lazy img-fluid' alt='' />
          </Reveal>
        </div>
      </div>
    </div>
  )
}
export default IntroImage

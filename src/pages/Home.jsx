import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="home-page">
      <section className="home-hero">
        <h1>Welcome to Farmart</h1>
        <p>
          Connect directly with local farmers and buyers. 
          Fresh produce, fair prices, sustainable agriculture.
        </p>
        
        <div className="home-cta">
          {isAuthenticated ? (
            <span>Hello, {user?.email}! You're logged in as a {user?.role}.</span>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline">
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="features">
        <h2>Why Farmart?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>For Farmers</h3>
            <p>
              Sell your produce directly to buyers. 
              No middlemen, better profits.
            </p>
          </div>
          <div className="feature-card">
            <h3>For Buyers</h3>
            <p>
              Get fresh, locally-sourced produce 
              delivered straight to your door.
            </p>
          </div>
          <div className="feature-card">
            <h3>Sustainable</h3>
            <p>
              Support local agriculture and reduce 
              your carbon footprint.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

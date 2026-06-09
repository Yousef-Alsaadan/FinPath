import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('FinPath error boundary:', error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-screen place-items-center p-6 text-center">
          <div className="surface max-w-md rounded-2xl p-8">
            <h1 className="text-lg font-bold">Something went wrong</h1>
            <p className="muted mt-2 text-sm">
              FinPath hit an unexpected error. Your data is safe on this device. Try reloading.
            </p>
            <button className="btn btn-primary mt-5" onClick={() => location.reload()}>
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

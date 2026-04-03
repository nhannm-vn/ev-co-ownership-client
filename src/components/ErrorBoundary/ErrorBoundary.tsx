import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button, Space } from 'antd'
import { ReloadOutlined, HomeOutlined, BugOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import logger from '../../utils/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Enhanced Error Boundary component to catch React errors
 * Prevents entire app from crashing when a component throws an error
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console/error tracking service
    logger.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Enhanced error UI
      return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 p-4'>
          <div className='max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8'>
            <div className='text-center mb-8'>
              <div className='mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse'>
                <ExclamationCircleOutlined className='text-4xl text-red-600' />
              </div>
              <h2 className='text-3xl font-bold text-gray-900 mb-3'>Oops! Something went wrong</h2>
              <p className='text-gray-600 text-lg mb-2'>
                We're sorry, but something unexpected happened.
              </p>
              <p className='text-gray-500 text-sm'>
                Our team has been notified and is working on a fix.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className='mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                <div className='flex items-center gap-2 mb-2'>
                  <BugOutlined className='text-gray-500' />
                  <h3 className='text-sm font-semibold text-gray-700'>Error Details (Development Only)</h3>
                </div>
                <div className='bg-gray-900 rounded p-3 mb-3'>
                  <p className='text-sm font-mono text-red-400 break-words'>
                    {this.state.error.toString()}
                  </p>
                </div>
                {this.state.errorInfo && (
                  <details className='mt-2'>
                    <summary className='text-sm text-gray-600 cursor-pointer hover:text-gray-800 transition-colors'>
                      View Stack Trace
                    </summary>
                    <pre className='text-xs mt-2 overflow-auto max-h-60 text-gray-700 bg-gray-100 p-3 rounded border border-gray-200'>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <Button
                type='primary'
                size='large'
                icon={<ReloadOutlined />}
                onClick={this.handleReset}
                className='flex-1 sm:flex-none'
              >
                Try Again
              </Button>
              <Button
                size='large'
                icon={<ReloadOutlined />}
                onClick={() => window.location.reload()}
                className='flex-1 sm:flex-none'
              >
                Refresh Page
              </Button>
              <Button
                size='large'
                icon={<HomeOutlined />}
                onClick={() => window.location.href = '/'}
                className='flex-1 sm:flex-none'
              >
                Go Home
              </Button>
            </div>

            <div className='mt-6 pt-6 border-t border-gray-200 text-center'>
              <p className='text-xs text-gray-500'>
                If this problem persists, please contact support with the error details above.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary













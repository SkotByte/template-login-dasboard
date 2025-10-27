import React, { useState } from 'react'
import { Form, Input, Progress, Alert } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { validatePassword, getPasswordStrengthIndicator } from '../../utils/passwordValidator'

const PasswordInput: React.FC = () => {
  const [password, setPassword] = useState('')
  const [validation, setValidation] = useState<ReturnType<typeof validatePassword> | null>(null)
  const [strength, setStrength] = useState<ReturnType<typeof getPasswordStrengthIndicator> | null>(null)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)

    if (value) {
      setValidation(validatePassword(value))
      setStrength(getPasswordStrengthIndicator(value))
    } else {
      setValidation(null)
      setStrength(null)
    }
  }

  return (
    <div className="space-y-4">
      <Form.Item
        label="Password"
        validateStatus={validation && !validation.isValid ? 'error' : ''}
        help={validation && !validation.isValid ? '' : undefined}
      >
        <Input.Password
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          className="h-12"
        />
      </Form.Item>

      {/* Password Strength Indicator */}
      {strength && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Password Strength:</span>
            <span className="text-sm font-semibold" style={{ color: strength.color }}>
              {strength.label}
            </span>
          </div>
          <Progress 
            percent={(strength.score / 6) * 100} 
            strokeColor={strength.color}
            showInfo={false}
            size="small"
          />
        </div>
      )}

      {/* Password Requirements */}
      {validation && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Password Requirements:</div>
          <div className="space-y-1">
            <PasswordRequirement
              met={password.length >= 8}
              text="At least 8 characters"
            />
            <PasswordRequirement
              met={/[A-Z]/.test(password)}
              text="One uppercase letter"
            />
            <PasswordRequirement
              met={/[a-z]/.test(password)}
              text="One lowercase letter"
            />
            <PasswordRequirement
              met={/\d/.test(password)}
              text="One number"
            />
            <PasswordRequirement
              met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)}
              text="One special character"
            />
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validation && !validation.isValid && validation.errors.length > 0 && (
        <Alert
          message="Password requirements not met"
          description={
            <ul className="list-disc list-inside">
              {validation.errors.map((error: string, index: number) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          }
          type="error"
          showIcon
        />
      )}

      {/* Success Message */}
      {validation && validation.isValid && (
        <Alert
          message={`Strong password! (${validation.strength})`}
          type="success"
          showIcon
        />
      )}
    </div>
  )
}

// Helper component for password requirements
const PasswordRequirement: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
  <div className="flex items-center gap-2 text-sm">
    {met ? (
      <CheckCircleOutlined className="text-green-500" />
    ) : (
      <CloseCircleOutlined className="text-gray-400" />
    )}
    <span className={met ? 'text-green-700' : 'text-gray-600'}>{text}</span>
  </div>
)

export default PasswordInput

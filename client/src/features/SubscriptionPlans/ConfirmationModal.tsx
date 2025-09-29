import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PayPalButton from './PaypalButton'

function ConfirmationDialog({
    plan,
    isOpen,
    onClose,
}: {
    plan: any
    isOpen: boolean
    onClose: () => void
}) {
    if (!isOpen || !plan) return null

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
            {/* Backdrop */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                onClick={onClose}
            />

            {/* Dialog */}
            <div className='relative mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-primary text-black shadow-xl'>
                {/* Header */}
                <div className='flex items-center justify-between border-b p-6'>
                    <div className='flex items-center gap-3'>
                        <div className='text-green-700'>{plan.icon}</div>
                        <div>
                            <h3 className='text-lg font-semibold'>
                                Confirm Your Plan
                            </h3>
                            <p className='text-sm text-gray-600'>
                                You're about to subscribe to {plan.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 transition-colors hover:text-gray-600'
                    >
                        <X className='h-5 w-5' />
                    </button>
                </div>

                {/* Content */}
                <div className='space-y-6 p-6'>
                    {/* Plan Summary */}
                    <div className='rounded-lg bg-gray-50 p-4'>
                        <div className='mb-3 flex items-center justify-between'>
                            <span className='font-medium'>
                                {plan.name} Plan
                            </span>
                            <span className='text-primary text-2xl font-bold'>
                                <span className='text-black'>{plan.price}</span>
                                {plan.priceAmount > 0 && (
                                    <span className='text-sm font-normal text-gray-600'>
                                        /month
                                    </span>
                                )}
                            </span>
                        </div>
                        <p className='mb-3 text-sm text-gray-600'>
                            {plan.description}
                        </p>
                        <div className='text-sm'>
                            <span className='font-medium'>{plan.prompts}</span>{' '}
                            prompts per month
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <h4 className='mb-3 font-medium'>What's included:</h4>
                        <ul className='space-y-2'>
                            {plan.features.map(
                                (feature: string, index: number) => (
                                    <li
                                        key={index}
                                        className='flex items-center text-sm'
                                    >
                                        <Check className='mr-3 h-4 w-4 flex-shrink-0 text-green-500' />
                                        {feature}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* PayPal Button */}
                    {plan.paypalPlanId && (
                        <div>
                            <h4 className='mb-3 font-medium'>
                                Complete your subscription:
                            </h4>
                            <PayPalButton planId={plan.paypalPlanId} />
                        </div>
                    )}

                    {/* Demo Message for plans without PayPal ID */}
                    {!plan.paypalPlanId && (
                        <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
                            <p className='text-sm text-yellow-800'>
                                This plan is not yet configured with PayPal.
                                Please contact support to proceed.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default ConfirmationDialog

import { Check, Crown, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

function SubscriptionPlans() {
    const plans = [
        {
            name: 'Basic',
            price: 'Free',
            priceAmount: 0,
            prompts: '1,000',
            isDefault: true,
            popular: false,
            icon: <Zap className='h-5 w-5' />,
            description: 'Perfect for getting started',
            features: [
                '1,000 prompts per month',
                'Basic support',
                'Standard response time',
            ],
        },
        {
            name: 'Starter',
            price: '$29',
            priceAmount: 29,
            prompts: '5,000',
            isDefault: false,
            popular: false,
            icon: <Zap className='h-5 w-5' />,
            description: 'Great for small teams',
            features: [
                '5,000 prompts per month',
                'Email support',
                'Priority response time',
            ],
        },
        {
            name: 'Growth',
            price: '$59',
            priceAmount: 59,
            prompts: '15,000',
            isDefault: false,
            popular: true,
            icon: <Crown className='h-5 w-5' />,
            description: 'Most popular choice',
            features: [
                '15,000 prompts per month',
                'Priority support',
                'Advanced features',
                'API access',
            ],
        },
        {
            name: 'Premium',
            price: '$99',
            priceAmount: 99,
            prompts: '25,000',
            isDefault: false,
            popular: false,
            icon: <Crown className='h-5 w-5' />,
            description: 'For growing businesses',
            features: [
                '25,000 prompts per month',
                '24/7 support',
                'All advanced features',
                'Custom integrations',
            ],
        },
        {
            name: 'Enterprise',
            price: '$299',
            priceAmount: 299,
            prompts: 'Unlimited',
            isDefault: false,
            popular: false,
            icon: <Crown className='h-5 w-5' />,
            description: 'Maximum power and flexibility',
            features: [
                'Unlimited prompts',
                'Dedicated support',
                'Custom solutions',
                'SLA guarantee',
            ],
        },
    ]

    return (
        <div className='mx-auto w-full max-w-[1200px] p-6'>
            <div className='mb-8 text-center'>
                <h2 className='mb-2 text-3xl font-bold'>Choose Your Plan</h2>
                <p className='text-muted-foreground'>
                    Select the perfect plan for your needs
                </p>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {plans.map((plan, index) => (
                    <Card
                        key={index}
                        className={`relative transition-all duration-300 hover:shadow-lg ${
                            plan.popular
                                ? 'border-primary scale-105 shadow-lg'
                                : ''
                        }`}
                    >
                        {plan.popular && (
                            <Badge className='bg-primary absolute -top-3 left-1/2 -translate-x-1/2 transform'>
                                Most Popular
                            </Badge>
                        )}

                        {plan.isDefault && (
                            <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 transform bg-green-600'>
                                Current Plan
                            </Badge>
                        )}

                        <CardHeader className='pb-4 text-center'>
                            <div className='text-primary mb-2 flex justify-center'>
                                {plan.icon}
                            </div>
                            <CardTitle className='text-xl'>
                                {plan.name}
                            </CardTitle>
                            <CardDescription>
                                {plan.description}
                            </CardDescription>
                            <div className='mt-4'>
                                <span className='text-3xl font-bold'>
                                    {plan.price}
                                </span>
                                {plan.priceAmount > 0 && (
                                    <span className='text-muted-foreground'>
                                        /month
                                    </span>
                                )}
                            </div>
                            <p className='text-muted-foreground mt-1 text-sm'>
                                {plan.prompts} prompts/month
                            </p>
                        </CardHeader>

                        <CardContent className='flex h-full flex-col'>
                            <ul className='mb-6 flex-1'>
                                {plan.features.map((feature, featureIndex) => (
                                    <li
                                        key={featureIndex}
                                        className='flex items-center text-sm'
                                    >
                                        <Check className='mr-3 h-4 w-4 flex-shrink-0 text-green-500' />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className='w-full'
                                variant={
                                    plan.isDefault
                                        ? 'outline'
                                        : plan.popular
                                          ? 'default'
                                          : 'outline'
                                }
                                disabled={plan.isDefault}
                            >
                                {plan.isDefault
                                    ? 'Current Plan'
                                    : 'Choose Plan'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default SubscriptionPlans

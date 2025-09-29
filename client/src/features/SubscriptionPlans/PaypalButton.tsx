import { useEffect, useState } from 'react'

function loadPayPalScript(clientId: string) {
    return new Promise<void>((resolve, reject) => {
        console.log(document.getElementById('paypal-sdk'), '+++++++++')
        if (document.getElementById('paypal-sdk')) {
            resolve()
            return
        }
        console.log('Appending script...')
        const script = document.createElement('script')
        script.id = 'paypal-sdk'
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`
        script.async = true
        script.onload = () => resolve()
        script.onerror = reject
        document.body.appendChild(script)
    })
}

function PayPalButton({ planId }: { planId: string }) {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        let paypalButtons: any // store instance for cleanup
        const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID

        console.log('Starteddd')

        loadPayPalScript(clientId).then(() => {
            setLoaded(true)
            console.log('In use Effect...')

            // @ts-ignore
            paypalButtons = window.paypal.Buttons({
                style: {
                    shape: 'rect',
                    color: 'gold',
                    layout: 'vertical',
                    label: 'subscribe',
                },
                createSubscription: (data: any, actions: any) => {
                    return actions.subscription.create({ plan_id: planId })
                },
                onApprove: (data: any) => {
                    fetch('/api/subscription/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            subscriptionId: data.subscriptionID,
                            planId: planId,
                        }),
                    })
                },
            })

            console.log(paypalButtons)

            if (paypalButtons) {
                console.log('rendering')
                paypalButtons.render(`#paypal-button-container-${planId}`)
            }
        })

        // 🧹 Cleanup: destroy PayPal button if component unmounts
        return () => {
            if (paypalButtons) {
                paypalButtons.close() // removes the button instance
            }
        }
    }, [planId])

    return (
        <div>
            {!loaded && (
                <button
                    className='w-full rounded bg-gray-300 p-2 text-gray-700'
                    disabled
                >
                    Loading PayPal…
                </button>
            )}
            <div id={`paypal-button-container-${planId}`} />
        </div>
    )
}

export default PayPalButton

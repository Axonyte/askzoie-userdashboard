import React, { cloneElement, ReactElement } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/config/apiClient'
import { Loader2 } from 'lucide-react'

interface SignedUrlImageProps {
    fileUrl: string
    children: ReactElement<React.ImgHTMLAttributes<HTMLImageElement>>
    fallback?: ReactElement
    loadingComponent?: ReactElement
}

function ImageSignedUrlInjector({
    fileUrl,
    children,
    fallback,
    loadingComponent,
}: SignedUrlImageProps) {
    const {
        data: signedUrl,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['signed-url', fileUrl],
        queryFn: async () => {
            const encodedFileUrl = encodeURIComponent(fileUrl)
            const response = await api.get(
                `/misc/media/signed-url?fileUrl=${encodedFileUrl}`
            )
            return response.data as string | null
        },
        enabled: !!fileUrl,
        staleTime: 1000 * 60 * 50, // 50 minutes (signed URLs typically last 1 hour)
    })

    // Show loading state
    if (isLoading) {
        if (loadingComponent) {
            return loadingComponent
        }

        // Default loading state - a placeholder with spinner
        return (
            <div
                className='bg-muted flex items-center justify-center rounded'
                style={{
                    width: children.props.width || '40px',
                    height: children.props.height || '40px',
                }}
            >
                <Loader2 className='text-muted-foreground h-4 w-4 animate-spin' />
            </div>
        )
    }

    // Show error state or fallback
    if (error || !signedUrl) {
        if (fallback) {
            return fallback
        }

        // Default fallback - clone the original img but with a fallback src
        return cloneElement(children, {
            src: undefined,
            alt: children.props.alt || 'Image failed to load',
            className: `${children.props.className || ''} bg-muted`,
            onError: undefined,
        })
    }

    // Success - inject the signed URL into the child component
    const { src, ...restProps } = children.props
    return cloneElement(children, {
        src: signedUrl,
        // Preserve other props from the original child
        ...restProps,
    })
}

export default ImageSignedUrlInjector

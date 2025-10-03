import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/config/apiClient'
import { FileText, UploadCloud } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface RagDoc {
    id: string
    botId: string
    filename: string
    docId: string
    chunks: number
    createdAt?: string
}

interface RagDocsProps {
    botId: string
}

export function RagDocsSection({ botId }: RagDocsProps) {
    const queryClient = useQueryClient()
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    // Fetch docs
    const {
        data: docs = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['rag-docs', botId],
        queryFn: async (): Promise<RagDoc[]> => {
            const res = await api.get(`/bot/rag-docs/${botId}`)
            return res.data
        },
    })

    // Upload mutation
    const uploadMutation = useMutation({
        mutationFn: async (files: File[]) => {
            const formData = new FormData()
            files.forEach((file) => {
                if (file.type !== 'application/pdf') {
                    throw new Error(`${file.name} is not a PDF`)
                }
                formData.append('files', file)
            })
            const res = await api.post(`/bot/upload/${botId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return res.data
        },
        onSuccess: () => {
            toast.success('PDFs uploaded successfully')
            queryClient.invalidateQueries({ queryKey: ['rag-docs', botId] })
        },
        onError: (err: any) => {
            toast.error(err.message || 'Upload failed')
        },
    })

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : []
        if (files.length > 0) {
            uploadMutation.mutate(files)
        }
    }

    return (
        <Card>
            <CardHeader className='flex items-center justify-between'>
                <CardTitle className='flex items-center'>
                    <FileText className='mr-2 h-5 w-5' />
                    Knowledge Documents
                </CardTitle>
                <div>
                    <input
                        type='file'
                        ref={fileInputRef}
                        className='hidden'
                        accept='application/pdf'
                        multiple
                        onChange={handleFilesSelected}
                    />
                    <Button
                        onClick={handleUploadClick}
                        disabled={uploadMutation.isPending}
                    >
                        <UploadCloud className='mr-2 h-4 w-4' />
                        {uploadMutation.isPending
                            ? 'Uploading...'
                            : 'Upload PDFs'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className='text-muted-foreground text-sm'>
                        Loading docs...
                    </div>
                ) : isError ? (
                    <div className='text-sm text-red-500'>
                        Failed to fetch documents.
                    </div>
                ) : docs.length > 0 ? (
                    <div className='space-y-3'>
                        {docs.map((doc) => (
                            <div
                                key={doc.id}
                                className='flex items-center justify-between rounded-md border p-3'
                            >
                                <div className='flex items-center space-x-3'>
                                    <FileText className='text-muted-foreground h-5 w-5' />
                                    <span className='text-sm font-medium'>
                                        {doc.filename}
                                    </span>
                                </div>
                                <Badge variant='secondary'>
                                    {doc.createdAt
                                        ? new Date(
                                              doc.createdAt
                                          ).toLocaleDateString('en-US', {
                                              month: 'short',
                                              day: 'numeric',
                                          })
                                        : 'Just added'}
                                </Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-muted-foreground rounded-md border border-dashed p-6 text-center text-sm'>
                        No documents uploaded yet.
                    </div>
                )}
                <Separator className='my-4' />
                <p className='text-muted-foreground text-xs'>
                    Upload PDFs to enhance your assistant’s knowledge base.
                </p>
            </CardContent>
        </Card>
    )
}

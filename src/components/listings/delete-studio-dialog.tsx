'use client';

import { useState } from 'react';
import { AlertCircle, Loader2, Trash2 } from 'lucide-react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getTokenFromClient } from '@/lib/getTokenFromClient';
import type { Studio } from '@/types';

interface DeleteStudioDialogProps {
	studio: Studio | null;
	isOpen: boolean;
	onClose: () => void;
	onDeleted: (deletedId: string) => void;
}

export function DeleteStudioDialog({ studio, isOpen, onClose, onDeleted }: DeleteStudioDialogProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	if (!studio) return null;

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			const apiUrl = process.env.NEXT_PUBLIC_API_URL;

			if (apiUrl) {
				const token = await getTokenFromClient();
				const res = await fetch(`${apiUrl}/api/studios/${studio._id}`, {
					method: 'DELETE',
					headers: {
						authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok) {
					const errorData = await res.json().catch(() => ({}));
					throw new Error(errorData.message || 'Failed to delete studio listing.');
				}
			}

			toast.success(`"${studio.title}" listing has been deleted.`);
			onDeleted(studio._id);
			onClose();
		} catch (error: unknown) {
			console.error('Delete studio error:', error);
			const message = error instanceof Error ? error.message : 'An error occurred while deleting studio.';
			toast.error(message);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={open => !open && !isDeleting && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="space-y-2">
					<div className="size-11 rounded-full bg-destructive/15 text-destructive flex items-center justify-center">
						<Trash2 className="size-5" />
					</div>
					<DialogTitle className="font-display text-lg sm:text-xl font-bold text-foreground">
						Delete Studio Listing
					</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground leading-relaxed">
						Are you sure you want to permanently delete <strong className="text-foreground">{studio.title}</strong>? This action will remove the listing, photos, and availability from the SetSpace marketplace. This cannot be undone.
					</DialogDescription>
				</DialogHeader>

				<div className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs flex items-start gap-2.5">
					<AlertCircle className="size-4 shrink-0 mt-0.5" />
					<span>Active reservations tied to this workspace will need to be settled or notified before deletion.</span>
				</div>

				<DialogFooter className="flex-col-reverse sm:flex-row gap-2.5 pt-2">
					<DialogClose render={<Button type="button" variant="outline" disabled={isDeleting} className="w-full sm:w-auto" />}>
						Cancel
					</DialogClose>
					<Button
						type="button"
						variant="destructive"
						disabled={isDeleting}
						onClick={handleDelete}
						className="w-full sm:w-auto font-medium"
					>
						{isDeleting ? (
							<>
								<Loader2 className="size-4 animate-spin" />
								<span>Deleting...</span>
							</>
						) : (
							<>
								<Trash2 className="size-4" />
								<span>Delete Listing</span>
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

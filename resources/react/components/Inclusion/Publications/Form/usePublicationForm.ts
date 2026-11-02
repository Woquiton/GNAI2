import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import type { PublicationRecord, PublicationFormOptions } from '../Publications.types';
import { publicationUrls } from '../Publications.routes';
import type { PublicationFormData } from './PublicationForm.types';
import { newSpeakerRow } from './PublicationForm.utils';

export function usePublicationForm(
    publication: PublicationRecord | undefined,
    options: PublicationFormOptions,
    canSubmit: boolean,
) {
    const [editorFailed, setEditorFailed] = useState(false);
    const form = useForm<PublicationFormData>({
        title: publication?.title ?? '',
        slug: publication?.slug ?? '',
        summary: publication?.summary ?? '',
        type: publication?.type ?? options.types[0]?.value ?? 'news',
        tag_ids: (publication?.tags ?? []).map((tag) => String(tag.id)),
        has_schedule: publication?.has_schedule ?? false,
        description: publication?.description_html ?? publication?.description ?? '',
        start_date: publication?.start_date ?? '',
        end_date: publication?.end_date ?? '',
        start_time: publication?.start_time ?? '',
        end_time: publication?.end_time ?? '',
        location: publication?.location ?? '',
        organizer: publication?.organizer ?? '',
        audience: publication?.audience ?? '',
        author_id: publication
            ? publication.author_id
                ? String(publication.author_id)
                : ''
            : options.defaultAuthorId
              ? String(options.defaultAuthorId)
              : '',
        speaker_rows: (publication?.speakers ?? []).map((speaker) =>
            newSpeakerRow({
                id: speaker.professional_id ? String(speaker.professional_id) : '',
                name: speaker.guest_name ?? '',
                guest: speaker.professional_id === null,
                participation: speaker.participation ?? '',
            }),
        ),
        link_url: publication?.link_url ?? '',
        link_label: publication?.link_label ?? '',
        cover: null,
        cover_alt: publication?.cover_alt ?? '',
        remove_cover: false,
        gallery: [],
        gallery_existing: (publication?.gallery ?? []).map((image) => ({
            ...image,
            remove: false,
        })),
        is_active: publication?.is_active ?? true,
        published_at: publication?.published_at ?? '',
        is_featured: publication?.is_featured ?? false,
        seo_title: publication?.seo_title ?? '',
        seo_description: publication?.seo_description ?? '',
    });
    const submission = useFormSubmission(form);
    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        submission.submit({
            url: publication ? publicationUrls.update(publication.id) : publicationUrls.store,
            method: publication ? 'put' : 'post',
            files: true,
            blocked: !canSubmit || editorFailed,
            failureText: 'Não foi possível salvar a publicação. Tente novamente.',
            transform: () => {
                const { speaker_rows: speakerRows, ...data } = form.data;
                return {
                    ...data,
                    speakers: speakerRows.map((row) => ({
                        id: row.guest ? '' : row.id,
                        name: row.guest ? row.name : '',
                        participation: row.participation,
                    })),
                    gallery: data.gallery.map((image) => ({ file: image.file, alt: image.alt })),
                    gallery_existing: data.gallery_existing.map((image) => ({
                        id: image.id,
                        alt: image.alt,
                        remove: image.remove,
                    })),
                };
            },
        });
    }
    function editorError(): void {
        setEditorFailed(true);
        form.setError(
            'description',
            'Não foi possível carregar o editor de texto. Atualize a página e tente novamente.',
        );
    }
    return { form, formRef: submission.formRef, submit, editorFailed, editorError };
}

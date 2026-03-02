import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    Title,
    Text,
    Paper,
    TextInput,
    Textarea,
    Select,
    Button,
    Stack,
    Group,
    Progress,
    SimpleGrid,
    Card,
    AspectRatio,
    ActionIcon,
    Badge,
    Box
} from "@mantine/core";
import { IconUpload, IconTrash, IconMovie } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

export default function Index({ auth, videos, products }) {
    // Inisialisasi Form Inertia
    const { data, setData, post, processing, progress, reset, errors } =
        useForm({
            title: "",
            description: "",
            product_id: "",
            video: null,
        });

    const submit = (e) => {
        e.preventDefault();
        post(route("staff.content.store"), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                notifications.show({
                    title: "Berhasil",
                    message: "Video konten telah diterbitkan",
                    color: "green",
                });
            },
        });
    };

    const deleteContent = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus konten ini?")) {
            // Kita gunakan router.delete bawaan jika tidak pakai useForm untuk delete
            import("@inertiajs/react").then(({ router }) => {
                router.delete(route("staff.content.destroy", id));
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Konten Video" />

            <Stack gap="xl">
                <Box>
                    <Title order={2}>Gudang Konten Video</Title>
                    <Text c="dimmed">
                        Upload bahan promosi video (TikTok/Reels) untuk
                        memberdayakan mahasiswa Anda.
                    </Text>
                </Box>

                <SimpleGrid
                    cols={{ base: 1, md: 2 }}
                    spacing="xl"
                    align="flex-start"
                >
                    {/* SEBELAH KIRI: FORM UPLOAD */}
                    <Paper withBorder p="xl" radius="md" shadow="sm">
                        <form onSubmit={submit}>
                            <Stack gap="md">
                                <Title order={4}>Upload Konten Baru</Title>

                                <TextInput
                                    label="Judul Konten"
                                    placeholder="Contoh: Review Jujur Produk X"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    error={errors.title}
                                    required
                                />

                                <Select
                                    label="Pilih Produk (Opsional)"
                                    placeholder="Hubungkan dengan produk Anda"
                                    data={products.map((p) => ({
                                        value: String(p.id),
                                        label: p.name,
                                    }))}
                                    value={data.product_id}
                                    onChange={(val) =>
                                        setData("product_id", val)
                                    }
                                    clearable
                                />

                                <Textarea
                                    label="Brief / Deskripsi untuk Mahasiswa"
                                    placeholder="Tulis instruksi atau caption yang disarankan..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={3}
                                />

                                <div>
                                    <Text size="sm" fw={500} mb={5}>
                                        File Video (MP4, Max 50MB)
                                    </Text>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) =>
                                            setData("video", e.target.files[0])
                                        }
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            fontSize: "14px",
                                        }}
                                    />
                                    {errors.video && (
                                        <Text color="red" size="xs" mt={5}>
                                            {errors.video}
                                        </Text>
                                    )}
                                </div>

                                {progress && (
                                    <Stack gap={5}>
                                        <Text size="xs" ta="right">
                                            {progress.percentage}% Selesai
                                        </Text>
                                        <Progress
                                            value={progress.percentage}
                                            animated
                                            color="indigo"
                                            size="lg"
                                        />
                                    </Stack>
                                )}

                                <Button
                                    type="submit"
                                    leftSection={<IconUpload size={18} />}
                                    loading={processing}
                                    color="indigo"
                                >
                                    Terbitkan Konten
                                </Button>
                            </Stack>
                        </form>
                    </Paper>

                    {/* SEBELAH KANAN: DAFTAR VIDEO */}
                    <Stack gap="md">
                        <Title order={4}>Konten Anda ({videos.length})</Title>
                        {videos.length === 0 ? (
                            <Paper withBorder p="xl" ta="center" bg="gray.0">
                                <IconMovie size={40} stroke={1} color="gray" />
                                <Text c="dimmed" size="sm">
                                    Belum ada video yang diupload.
                                </Text>
                            </Paper>
                        ) : (
                            <SimpleGrid cols={{ base: 1, sm: 2 }}>
                                {videos.map((v) => (
                                    <Card
                                        key={v.id}
                                        withBorder
                                        padding="xs"
                                        radius="md"
                                    >
                                        <Card.Section>
                                            <AspectRatio ratio={9 / 16}>
                                                <video
                                                    src={`/storage/${v.video_path}`}
                                                    muted
                                                />
                                            </AspectRatio>
                                        </Card.Section>

                                        <Group justify="space-between" mt="xs">
                                            <Text fw={600} size="sm" truncate>
                                                {v.title}
                                            </Text>
                                            <ActionIcon
                                                variant="subtle"
                                                color="red"
                                                onClick={() =>
                                                    deleteContent(v.id)
                                                }
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Group>
                                        {v.product && (
                                            <Badge
                                                size="xs"
                                                variant="light"
                                                color="blue"
                                            >
                                                {v.product.name}
                                            </Badge>
                                        )}
                                    </Card>
                                ))}
                            </SimpleGrid>
                        )}
                    </Stack>
                </SimpleGrid>
            </Stack>
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    TextInput,
    NumberInput,
    Textarea,
    Button,
    Paper,
    Stack,
    Grid,
    Title,
    Text,
    Group,
    AspectRatio,
    Box,
    Progress,
    ActionIcon,
    Divider,
} from "@mantine/core";
import {
    IconArrowLeft,
    IconPhoto,
    IconVideo,
    IconUpload,
    IconX,
    IconDeviceFloppy,
} from "@tabler/icons-react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

export default function Edit({ auth, product }) {
    // Preview menggunakan path dari database sebagai nilai awal
    const [imagePreview, setImagePreview] = useState(
        product.image ? `/storage/${product.image}` : null,
    );
    const [videoPreview, setVideoPreview] = useState(
        product.video_url ? `/storage/${product.video_url}` : null,
    );

    const { data, setData, post, processing, errors, progress } = useForm({
        _method: "PUT", // Penting: Laravel butuh ini untuk handle spoofing method saat upload file
        name: product.name || "",
        price: product.price || "",
        commission_amount: product.commission_amount || "",
        stock: product.stock || "",
        description: product.description || "",
        product_link: product.product_link || "",
        image: null, // Default null agar tidak overwrite jika tidak ganti file
        video_url: null,
        video_brief: product.video_brief || "",
    });

    const handleImageChange = (file) => {
        if (file) {
            setData("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleVideoChange = (file) => {
        if (file) {
            setData("video", file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        // Gunakan POST dengan _method: PUT karena PHP/Laravel tidak bisa baca FormData via PUT asli
        post(route("staff.product.update", product.id), {
            forceFormData: true,
            onSuccess: () => {
                notifications.show({
                    title: "Berhasil",
                    message: "Produk diperbarui",
                    color: "green",
                });
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit - ${product.name}`} />

            <Stack gap="lg">
                <Group justify="space-between">
                    <Group>
                        <ActionIcon
                            component={Link}
                            href={route("staff.product.index")}
                            variant="subtle"
                        >
                            <IconArrowLeft size={20} />
                        </ActionIcon>
                        <Title order={3}>Edit Produk</Title>
                    </Group>
                </Group>

                <form onSubmit={submit}>
                    <Grid gutter="xl">
                        <Grid.Col span={{ base: 12, md: 7 }}>
                            <Paper withBorder p="xl" radius="md" shadow="sm">
                                <Stack gap="md">
                                    <TextInput
                                        label="Nama Produk"
                                        required
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        error={errors.name}
                                    />

                                    <Grid grow>
                                        <Grid.Col span={6}>
                                            <NumberInput
                                                label="Harga Jual (Rp)"
                                                hideControls
                                                required
                                                value={data.price}
                                                onChange={(val) =>
                                                    setData("price", val)
                                                }
                                                error={errors.price}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <NumberInput
                                                label="Komisi Affiliate (Rp)"
                                                hideControls
                                                required
                                                value={data.commission_amount}
                                                onChange={(val) =>
                                                    setData(
                                                        "commission_amount",
                                                        val,
                                                    )
                                                }
                                                error={errors.commission_amount}
                                            />
                                        </Grid.Col>
                                    </Grid>

                                    <TextInput
                                        label="Link Produk Shopee/Toko"
                                        value={data.product_link}
                                        onChange={(e) =>
                                            setData(
                                                "product_link",
                                                e.target.value,
                                            )
                                        }
                                        error={errors.product_link}
                                    />

                                    <Textarea
                                        label="Deskripsi Produk"
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                    />

                                    <Divider
                                        label="Instruksi Konten"
                                        labelPosition="center"
                                        my="sm"
                                    />

                                    <Textarea
                                        label="Brief Video Konten"
                                        placeholder="Berikan instruksi khusus untuk mahasiswa..."
                                        rows={3}
                                        value={data.video_brief}
                                        onChange={(e) =>
                                            setData(
                                                "video_brief",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Stack>
                            </Paper>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 5 }}>
                            <Stack gap="md">
                                {/* Edit Foto */}
                                <Paper withBorder p="md" radius="md">
                                    <Text fw={600} size="sm" mb="xs">
                                        Ganti Foto Produk
                                    </Text>
                                    <Box pos="relative">
                                        <img
                                            src={imagePreview}
                                            style={{
                                                width: "100%",
                                                borderRadius: "8px",
                                                maxHeight: "200px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <ActionIcon
                                            color="blue"
                                            pos="absolute"
                                            top={5}
                                            right={5}
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "image-input",
                                                    )
                                                    .click()
                                            }
                                        >
                                            <IconPhoto size={16} />
                                        </ActionIcon>
                                    </Box>
                                    <input
                                        id="image-input"
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleImageChange(e.target.files[0])
                                        }
                                    />
                                </Paper>

                                {/* Edit Video */}
                                <Paper withBorder p="md" radius="md">
                                    <Text fw={600} size="sm" mb="xs">
                                        Ganti Video Konten
                                    </Text>
                                    <Box pos="relative">
                                        <AspectRatio
                                            ratio={9 / 16}
                                            style={{
                                                maxWidth: "200px",
                                                margin: "auto",
                                            }}
                                        >
                                            <video
                                                src={videoPreview}
                                                controls
                                                style={{
                                                    borderRadius: "8px",
                                                    backgroundColor: "black",
                                                }}
                                            />
                                        </AspectRatio>
                                        <ActionIcon
                                            color="blue"
                                            pos="absolute"
                                            top={5}
                                            right={5}
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "video-input",
                                                    )
                                                    .click()
                                            }
                                        >
                                            <IconVideo size={16} />
                                        </ActionIcon>
                                    </Box>
                                    <input
                                        id="video-input"
                                        type="file"
                                        hidden
                                        accept="video/*"
                                        onChange={(e) =>
                                            handleVideoChange(e.target.files[0])
                                        }
                                    />
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        mt="xs"
                                        ta="center"
                                    >
                                        Disarankan format vertikal 9:16
                                    </Text>
                                </Paper>

                                {progress && (
                                    <Paper withBorder p="md" radius="md">
                                        <Text size="xs" mb={5} fw={700}>
                                            Updating: {progress.percentage}%
                                        </Text>
                                        <Progress
                                            value={progress.percentage}
                                            animated
                                            color="green"
                                        />
                                    </Paper>
                                )}

                                <Button
                                    size="lg"
                                    fullWidth
                                    type="submit"
                                    loading={processing}
                                    leftSection={<IconDeviceFloppy size={20} />}
                                    color="teal"
                                >
                                    Simpan Perubahan
                                </Button>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </form>
            </Stack>
        </AuthenticatedLayout>
    );
}

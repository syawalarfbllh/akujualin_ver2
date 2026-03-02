import { Link, useForm, usePage } from "@inertiajs/react";
import {
    TextInput,
    Button,
    Stack,
    Title,
    Text,
    Group,
    Transition,
    Box,
    Avatar,
    FileButton,
    ActionIcon,
    SimpleGrid,
    NumberInput,
    Textarea,
    Paper,
    Indicator,
    Divider,
    Badge,
} from "@mantine/core";
import {
    IconDeviceFloppy,
    IconMail,
    IconUser,
    IconCamera,
    IconBrandWhatsapp,
    IconBrandInstagram,
    IconBrandTiktok,
    IconLink,
    IconPhone,
    IconChartBar,
} from "@tabler/icons-react";

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name || "",
            email: user.email || "",
            phone_number: user.phone_number || "",
            whatsapp: user.whatsapp || "",
            instagram_username: user.instagram_username || "",
            ig_followers: user.ig_followers || 0,
            ig_profile_url: user.ig_profile_url || "",
            tiktok_username: user.tiktok_username || "",
            tiktok_followers: user.tiktok_followers || 0,
            tiktok_profile_url: user.tiktok_profile_url || "",
            bio: user.bio || "",
            avatar: null,
            _method: "PATCH",
        });

    const submit = (e) => {
        e.preventDefault();
        post(route("profile.update"), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <Box className={className}>
            <form onSubmit={submit}>
                <Stack gap={30}>
                    {/* 1. IDENTITAS UTAMA & FOTO */}
                    <Paper withBorder p="xl" radius="md" shadow="sm">
                        <Group align="center" gap="xl">
                            <Indicator
                                inline
                                size={20}
                                offset={7}
                                position="bottom-end"
                                label={
                                    <FileButton
                                        onChange={(file) =>
                                            setData("avatar", file)
                                        }
                                        accept="image/png,image/jpeg"
                                    >
                                        {(props) => (
                                            <ActionIcon
                                                {...props}
                                                variant="filled"
                                                size="lg"
                                                radius="xl"
                                                color="blue"
                                            >
                                                <IconCamera size={18} />
                                            </ActionIcon>
                                        )}
                                    </FileButton>
                                }
                            >
                                <Avatar
                                    src={
                                        data.avatar
                                            ? URL.createObjectURL(data.avatar)
                                            : user.avatar
                                    }
                                    size={120}
                                    radius="md"
                                    variant="light"
                                />
                            </Indicator>
                            <Box style={{ flex: 1 }}>
                                <Title order={3} fw={800}>
                                    {user.name}
                                </Title>
                                <Text c="dimmed" size="sm" mb="md">
                                    Mahasiswa / Affiliator
                                </Text>
                                <Badge size="lg" variant="dot" color="blue">
                                    Leaderboard Rank: #12
                                </Badge>
                            </Box>
                        </Group>
                    </Paper>

                    {/* 2. DATA SOSIAL MEDIA (Kredibilitas untuk UMKM) */}
                    <Box>
                        <Group mb="xs">
                            <IconChartBar size={20} color="blue" />
                            <Title order={4} fw={700}>
                                Kredibilitas Media Sosial
                            </Title>
                        </Group>
                        <Text size="xs" c="dimmed" mb="lg">
                            Data ini akan dilihat oleh UMKM saat mencari partner
                            promosi.
                        </Text>

                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                            {/* INSTAGRAM CARD */}
                            <Paper withBorder p="md" radius="md">
                                <Group mb="md">
                                    <IconBrandInstagram
                                        size={24}
                                        color="#E1306C"
                                    />
                                    <Text fw={700}>Instagram Profile</Text>
                                </Group>
                                <Stack gap="sm">
                                    <TextInput
                                        label="Username"
                                        placeholder="@username"
                                        value={data.instagram_username}
                                        onChange={(e) =>
                                            setData(
                                                "instagram_username",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <NumberInput
                                        label="Jumlah Pengikut (Followers)"
                                        hideControls
                                        value={data.ig_followers}
                                        onChange={(val) =>
                                            setData("ig_followers", val)
                                        }
                                    />
                                    <TextInput
                                        label="URL Profile"
                                        leftSection={<IconLink size={14} />}
                                        placeholder="https://instagram.com/..."
                                        value={data.ig_profile_url}
                                        onChange={(e) =>
                                            setData(
                                                "ig_profile_url",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Stack>
                            </Paper>

                            {/* TIKTOK CARD */}
                            <Paper withBorder p="md" radius="md">
                                <Group mb="md">
                                    <IconBrandTiktok size={24} color="black" />
                                    <Text fw={700}>TikTok Profile</Text>
                                </Group>
                                <Stack gap="sm">
                                    <TextInput
                                        label="Username"
                                        placeholder="@username"
                                        value={data.tiktok_username}
                                        onChange={(e) =>
                                            setData(
                                                "tiktok_username",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <NumberInput
                                        label="Jumlah Pengikut (Followers)"
                                        hideControls
                                        value={data.tiktok_followers}
                                        onChange={(val) =>
                                            setData("tiktok_followers", val)
                                        }
                                    />
                                    <TextInput
                                        label="URL Profile"
                                        leftSection={<IconLink size={14} />}
                                        placeholder="https://tiktok.com/@..."
                                        value={data.tiktok_profile_url}
                                        onChange={(e) =>
                                            setData(
                                                "tiktok_profile_url",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Stack>
                            </Paper>
                        </SimpleGrid>
                    </Box>

                    {/* 3. KONTAK & BIO (Untuk Tombol 'Hubungi' UMKM) */}
                    <Paper withBorder p="xl" radius="md">
                        <Title order={4} fw={700} mb="lg">
                            Informasi Kontak & Bio
                        </Title>
                        <SimpleGrid
                            cols={{ base: 1, md: 2 }}
                            spacing="lg"
                            mb="lg"
                        >
                            <TextInput
                                label="Nomor WhatsApp"
                                description="Pastikan aktif untuk dihubungi UMKM"
                                leftSection={
                                    <IconBrandWhatsapp
                                        size={18}
                                        color="green"
                                    />
                                }
                                value={data.whatsapp}
                                onChange={(e) =>
                                    setData("whatsapp", e.target.value)
                                }
                            />
                            <TextInput
                                label="Nomor Telepon"
                                description="Pastikan aktif untuk verifikasi dan komunikasi penting"
                                leftSection={<IconPhone size={18} />}
                                value={data.phone_number}
                                onChange={(e) =>
                                    setData("phone_number", e.target.value)
                                }
                            />
                        </SimpleGrid>
                        <Textarea
                            label="Bio Portofolio"
                            description="Tuliskan gaya promosi Anda agar UMKM tertarik bekerja sama"
                            placeholder="Saya ahli dalam membuat video review produk kecantikan..."
                            minRows={4}
                            value={data.bio}
                            onChange={(e) => setData("bio", e.target.value)}
                        />
                    </Paper>

                    {/* ACTION BUTTON */}
                    <Paper
                        withBorder
                        p="md"
                        radius="md"
                        style={{ borderStyle: "dashed" }}
                    >
                        <Group justify="space-between">
                            <Box>
                                <Transition
                                    mounted={recentlySuccessful}
                                    transition="fade"
                                >
                                    {(styles) => (
                                        <Text
                                            size="sm"
                                            c="teal"
                                            fw={600}
                                            style={styles}
                                        >
                                            ✓ Profil berhasil diperbarui secara
                                            lengkap
                                        </Text>
                                    )}
                                </Transition>
                            </Box>
                            <Button
                                type="submit"
                                loading={processing}
                                leftSection={<IconDeviceFloppy size={18} />}
                                radius="md"
                            >
                                Simpan Portofolio Profil
                            </Button>
                        </Group>
                    </Paper>
                </Stack>
            </form>
        </Box>
    );
}

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Container, Stack, Title, Text, Box, Divider } from "@mantine/core";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePaymentInformationForm from "./Partials/UpdatePaymentInformationForm";

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pengaturan Profil" />

            {/* Container dibuat agak lebar (md atau 900px) agar form medsos tidak sesak */}
            <Container size="md" py={40}>
                <Stack gap={40}>
                    {/* HEADER HALAMAN */}
                    <Box>
                        <Title order={1} fw={900} lts="-1px">
                            Pengaturan Akun
                        </Title>
                        <Text c="dimmed" size="sm">
                            Kelola informasi publik, data pembayaran, dan
                            keamanan akun Anda.
                        </Text>
                    </Box>

                    {/* 1. INFORMASI PROFIL & SOSMED */}
                    {/* Kita tidak membungkusnya dengan Paper di sini karena 
                        UpdateProfileInformationForm sudah punya Paper di dalamnya */}
                    <Box>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </Box>

                    <Divider size="xs" />

                    {/* 2. KEAMANAN */}
                    <Box>
                        <Title order={3} mb="lg" fw={700}>
                            Keamanan
                        </Title>
                        <UpdatePasswordForm />
                    </Box>

                    <Divider size="xs" />

                    {/* 3. AREA BERBAHAYA */}
                    <Box
                        p="xl"
                        style={{
                            borderRadius: "8px",
                            border: "1px solid var(--mantine-color-red-2)",
                            backgroundColor: "var(--mantine-color-red-0)",
                        }}
                    >
                        <DeleteUserForm />
                    </Box>
                </Stack>
            </Container>
        </AuthenticatedLayout>
    );
}

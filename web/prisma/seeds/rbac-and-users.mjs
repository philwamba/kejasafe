import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

const PERMISSIONS = [
    ['manage_users', 'Create, edit, and deactivate user accounts.'],
    ['manage_settings', 'Edit platform settings and backend configuration.'],
    ['view_audit_logs', 'Read the audit and activity logs.'],
    ['manage_listings', 'Create and edit property listings.'],
    ['approve_listings', 'Approve or reject property submissions.'],
    ['moderate_reports', 'Handle reports and moderation queue.'],
    ['manage_inquiries', 'Respond to inquiries.'],
    ['manage_bookings', 'Manage bookings and viewings.'],
    ['manage_property_reviews', 'Moderate property reviews.'],
    ['manage_featured_listings', 'Mark listings as featured.'],
]

const ROLE_MATRIX = {
    super_admin: PERMISSIONS.map(([name]) => name),
    admin: [
        'manage_users',
        'manage_settings',
        'view_audit_logs',
        'manage_listings',
        'approve_listings',
        'moderate_reports',
        'manage_inquiries',
        'manage_bookings',
        'manage_property_reviews',
        'manage_featured_listings',
    ],
    moderator: [
        'manage_listings',
        'approve_listings',
        'moderate_reports',
        'manage_inquiries',
        'manage_bookings',
        'manage_property_reviews',
    ],
    landlord: ['manage_listings', 'manage_inquiries', 'manage_bookings'],
    agent: ['manage_listings', 'manage_inquiries', 'manage_bookings'],
    property_manager: ['manage_listings', 'manage_inquiries', 'manage_bookings'],
    tenant: [],
    viewer: [],
}

const ROLE_DESCRIPTIONS = {
    super_admin: 'Full access to every surface and setting.',
    admin: 'Day-to-day platform administration.',
    moderator: 'Approves property submissions and handles reports.',
    landlord: 'Owns and manages their own listings.',
    agent: 'Represents landlords and manages listings.',
    property_manager: 'Manages a portfolio of properties on behalf of owners.',
    tenant: 'Browses and contacts landlords.',
    viewer: 'Read-only access for audit or support shadowing.',
}

const USERS = [
    {
        email: 'kelvinthuku94+admin@gmail.com',
        fullName: 'Kelvin Thuku (Admin)',
        phone: '+254700000001',
        roles: ['admin'],
    },
    {
        email: 'kelvinthuku94+owner@gmail.com',
        fullName: 'Kelvin Thuku (Owner)',
        phone: '+254700000002',
        roles: ['landlord'],
    },
]

async function main() {
    const permissionByName = new Map()
    for (const [name, description] of PERMISSIONS) {
        const permission = await prisma.permission.upsert({
            where: { name },
            update: { description },
            create: { name, description },
        })
        permissionByName.set(name, permission)
    }

    const roleByName = new Map()
    for (const [roleName, permissionNames] of Object.entries(ROLE_MATRIX)) {
        const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {
                description: ROLE_DESCRIPTIONS[roleName],
                isSystem: true,
            },
            create: {
                name: roleName,
                description: ROLE_DESCRIPTIONS[roleName],
                isSystem: true,
            },
        })
        roleByName.set(roleName, role)

        // Sync role permissions: delete existing, re-insert desired
        await prisma.rolePermission.deleteMany({ where: { roleId: role.id } })
        if (permissionNames.length > 0) {
            await prisma.rolePermission.createMany({
                data: permissionNames.map(permissionName => ({
                    roleId: role.id,
                    permissionId: permissionByName.get(permissionName).id,
                })),
                skipDuplicates: true,
            })
        }
    }

    const password = 'ChangeMe123!'
    const passwordHash = await argon2.hash(password)

    for (const userSpec of USERS) {
        const user = await prisma.user.upsert({
            where: { email: userSpec.email },
            update: {
                fullName: userSpec.fullName,
                phone: userSpec.phone,
                status: 'active',
                emailVerifiedAt: new Date(),
            },
            create: {
                email: userSpec.email,
                fullName: userSpec.fullName,
                phone: userSpec.phone,
                passwordHash,
                status: 'active',
                emailVerifiedAt: new Date(),
                profile: { create: {} },
            },
        })

        // Sync user roles
        await prisma.userRole.deleteMany({ where: { userId: user.id } })
        for (const roleName of userSpec.roles) {
            await prisma.userRole.create({
                data: {
                    userId: user.id,
                    roleId: roleByName.get(roleName).id,
                },
            })
        }

        console.log(
            `  ✓ ${userSpec.email} → roles=[${userSpec.roles.join(', ')}]`,
        )
    }

    console.log('\nDefault password for new users: ChangeMe123!')
    console.log(
        `Seeded ${PERMISSIONS.length} permissions, ${Object.keys(ROLE_MATRIX).length} roles, ${USERS.length} users.`,
    )
}

main()
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())

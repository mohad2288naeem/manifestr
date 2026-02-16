import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

export enum VaultItemType {
    FILE = "file",
    FOLDER = "folder"
}

export enum VaultItemStatus {
    DRAFT = "Draft",
    IN_PROGRESS = "In Progress",
    IN_REVIEW = "In Review",
    FINAL = "Final"
}

@Entity("vault_items")
export class VaultItem {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column({
        type: "enum",
        enum: VaultItemType,
        default: VaultItemType.FILE
    })
    type: VaultItemType;

    @Column({
        type: "enum",
        enum: VaultItemStatus,
        default: VaultItemStatus.DRAFT
    })
    status: VaultItemStatus;

    @Column({ nullable: true })
    project: string;

    @Column({ nullable: true })
    file_key: string; // S3 Key

    @Column({ nullable: true })
    thumbnail_url: string;

    @Column({ type: "int", nullable: true })
    size: number; // in bytes

    @Column({ nullable: true })
    parent_id: string | null; // For recursive folders

    @ManyToOne(() => VaultItem, { nullable: true })
    @JoinColumn({ name: "parent_id" })
    parent: VaultItem;

    @Column({ type: "jsonb", nullable: true })
    meta: any;

    // Ownership
    @Column({ type: "varchar", length: 255 })
    userId: string; // Supabase UUID

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "userId" })
    user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

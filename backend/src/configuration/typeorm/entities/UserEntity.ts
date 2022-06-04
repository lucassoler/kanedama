import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("text")
    name: string

    @Column("text")
    email: string

    @Column("text")
    password: string
}
CREATE TABLE IF NOT EXISTS public.admin (
        id SERIAL NOT NULL,
        name text,
        email text ,    
        password text ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.User (
        id SERIAL NOT NULL,
        username text,
        email text ,
        password text ,
        status text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.pdf (
        id SERIAL NOT NULL,
        userid SERIAL NOT NULL,
        fileurl text ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id)) ;

CREATE TABLE IF NOT EXISTS public.word (
        id SERIAL NOT NULL,
        userid SERIAL NOT NULL,
        fileurl text ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id)) ;



CREATE TABLE IF NOT EXISTS public.privacyPolicys (
        id SERIAL,
        title text NOT NULL,
        content text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.TermsConditions (
        id SERIAL,
        title text NOT NULL,
        content text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.favword (
        id SERIAL NOT NULL,
        userid SERIAL NOT NULL,
        docid SERIAL NOT NULL,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.favpdf (
        id SERIAL NOT NULL,
        userid SERIAL NOT NULL,
        docid SERIAL NOT NULL,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id));
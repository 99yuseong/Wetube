import Video from "../models/Video";
import Channel from "../models/Channel";

export const join = async (req, res) => {
    if (req.method === "GET") {
        return res.render("channel/join");
    }

    if (req.method === "POST") {
        const {
            body: { email, password, password2, name, description },
            file,
        } = req;

        const emailNameCheck = await Channel.exists({
            $or: [{ email }, { name }],
        });
        if (emailNameCheck) {
            console.log("email or name is already taken.");
            return res.status(404).render("base/404");
        }

        if (password !== password2) {
            console.log("password confirmation error");
            return res.status(404).render("base/404");
        }

        await Channel.create({
            email,
            password: await Channel.pwHash(password),
            name,
            avatarUrl: file ? file.path : "uploads/avatars/Default Avatar.png",
            description,
        });
        return res.status(201).redirect("/login");
    }
};

export const login = async (req, res) => {
    if (req.method === "GET") {
        return res.status(200).render("channel/login");
    }
    if (req.method === "POST") {
        const {
            body: { email, password },
        } = req;

        const channel = await Channel.findOne({ email });
        if (!channel) {
            console.log("email not exists");
            return res.status(400).redirect("/login");
        }
        const match = await Channel.pwCheck(password, channel.password);
        if (!match) {
            console.log("password not correct");
            return res.status(400).redirect("login");
        }

        req.session.channel = channel;
        req.session.loggedIn = true;
        return res.status(200).redirect("/");
    }
};

export const edit = async (req, res) => {
    const {
        params: { id },
        session: { channel },
    } = req;

    if (req.method === "GET") {
        if (id !== channel._id.valueOf()) {
            console.log("Not channel Owner");
            return res.status(404).redirect("/");
        }
        return res.status(200).render("channel/edit", { channel });
    }

    if (req.method === "POST") {
        const {
            body: { name, description },
            file,
        } = req;
        console.log(name, description, file);

        const nameExists = await Channel.findOne({ name });
        if (nameExists && id !== nameExists._id.valueOf()) {
            console.log("Channel name already exists");
            return res.status(400).redirect("edit");
        }

        const editedChannel = await Channel.findByIdAndUpdate(
            id,
            {
                name,
                description,
                avatarUrl: file ? file.path : channel.avatarUrl,
            },
            { new: true }
        );

        req.session.channel = editedChannel;

        console.log("Saved");
        return res.status(200).redirect("edit");
    }
};

export const changePassword = async (req, res) => {
    const {
        params: { id },
        session: { channel },
    } = req;
    if (req.method === "GET") {
        if (id !== channel._id.valueOf()) {
            console.log("Not channel Owner");
            return res.status(404).redirect("/");
        }
        return res.status(200).render("channel/changePassword");
    }
    if (req.method === "POST") {
        const {
            body: { old, new1, new2 },
        } = req;

        const channel = await Channel.findById(id);
        const match = await Channel.pwCheck(old, channel.password);

        if (!match) {
            console.log("wrong password");
            return res.status(400).redirect(`/channel/${id}/changePassword`);
        }
        if (new1 !== new2) {
            console.log("password confrimation error");
            return res.status(400).redirect(`/channel/${id}/changePassword`);
        }
        if (old === new1) {
            console.log("change to different password");
            return res.status(400).redirect(`/channel/${id}/changePassword`);
        }
        channel.password = await Channel.pwHash(new1);
        channel.save();
        return res.status(200).redirect(`/channel/${id}/edit`);
    }
};

export const showChannel = async (req, res) => {
    const {
        params: { id },
    } = req;
    const channel = await Channel.findById(id).populate("videos");
    return res.status(200).render("channel/channel", { channel });
};

export const remove = async (req, res) => {
    const {
        params: { id },
        session: { channel },
    } = req;
    if (req.method === "GET") {
        if (id !== channel._id.valueOf()) {
            console.log("Not channel Owner");
            return res.status(404).redirect("/");
        }
        return res.status(200).render("channel/remove");
    }
    if (req.method === "POST") {
        const {
            body: { remove },
        } = req;
        if (remove !== channel.name) {
            console.log("Enter your channel name.");
            return res.status(404).redirect("deleteChannel");
        }
        await Channel.findByIdAndDelete(id);
        req.session.destroy();
        // upload한 video들 삭제 해야함
        // avatar도 삭제해야함
        return res.redirect("/");
    }
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const showSubscriptions = (req, res) => {};

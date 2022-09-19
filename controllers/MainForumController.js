import MainForum from '../models/MainForumModel.js';
import validator from 'validator';
import SubForum from '../models/SubForumModel.js';

export const getAllForum = async (req, res) => {
  try {
    const forums = await MainForum.findAll({ include: [SubForum] });
    res.status(200).json(forums);
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllMainForum = async (req, res) => {
  try {
    const mainForums = await MainForum.findAll({
      attributes: ['id', 'title'],
    });

    res.status(200).json(mainForums);
  } catch (error) {
    console.log(error.message);
  }
};

export const getMainForumById = async (req, res) => {
  try {
    const response = await MainForum.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const tambahMainForum = async (req, res) => {
  const title = req.body.title.toLowerCase();
  if (validator.isEmpty(title)) return res.status(204).json({ msg: 'Judul harus diisi' });

  try {
    const duplikatTitleMainForum = await MainForum.findOne({
      where: { title: title },
    });

    if (duplikatTitleMainForum !== null) return res.status(422).json({ msg: 'Judul sudah ada' });

    await MainForum.create({ title });
    res.status(201).json({ msg: 'Main Forum berhasil dibuat' });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateMainForum = async (req, res) => {
  const { oldTitle, newTitle } = req.body;
  if (validator.isEmpty(newTitle)) return res.status(204).json({ msg: 'Judul harus diisi' });

  try {
    if (oldTitle !== newTitle) {
      const duplikatMainForum = await MainForum.findOne({
        where: { title: newTitle.toLowerCase() },
      });

      if (duplikatMainForum !== null) return res.status(400).json({ msg: 'Judul sudah ada' });
    }

    await MainForum.create({ title });
    res.status(201).json({ msg: 'Main forum berhasil diupdate' });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteMainForum = async (req, res) => {
  const mainForum = await MainForum.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!mainForum) return res.status(404).json({ msg: 'Data tidak ditemukan' });

  try {
    await MainForum.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: 'Main Forum berhasil dihapus' });
  } catch (error) {
    console.log(error.message);
  }
};
